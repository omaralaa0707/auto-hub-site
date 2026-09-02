"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { useWebglHealth } from "@/lib/use-webgl-health";

/**
 * Auto Hub's signature piece: the screen.
 *
 * Their feed is a record — seven of the last twelve posts are marked #sold —
 * so the page is printed rather than displayed, and every photograph on it
 * goes through a real halftone screen: a grid rotated to 15°, one sample per
 * cell, and a dot whose radius is that cell's luminance. White ink on a
 * charcoal ground, because a record is a negative of a shop window.
 *
 * The screen frequency is the data channel, which is the part that matters.
 * A car still available prints at a fine screen and reads sharply. A car that
 * has gone prints coarse, and you can see the grid before you can see the car.
 * Nothing is greyed out, nothing is crossed through: the resolution *is* the
 * status, and the copy says so.
 *
 * The pointer raises the local frequency inside a small radius — a loupe of
 * resolution rather than of magnification, so a sold car can be read again by
 * looking straight at it. Two screens are computed and mixed under that mask,
 * because interpolating the cell size itself would break the grid alignment
 * and turn the dots into moiré.
 */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  uniform sampler2D uTex;
  uniform vec2  uTexAspect;   // cover-fit scale/offset inputs
  uniform vec2  uRes;         // canvas size in px
  uniform float uCoarse;      // 0 = available (fine screen), 1 = sold (coarse)
  uniform vec2  uPointer;     // in uv space
  uniform float uPointerOn;
  uniform float uReveal;      // 0..1 print-in
  uniform vec3  uInk;
  uniform vec3  uGround;

  varying vec2 vUv;

  const float ANGLE = 0.26179939;   // 15°, the classic screen angle
  const float FINE  = 5.2;          // px per cell
  const float COARSE = 11.5;

  mat2 rot(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }

  // Cover-fit so a portrait source never squashes into a landscape canvas.
  // The sampled range must *shrink* on the overflowing axis — dividing here
  // instead of multiplying gives contain, and samples off the end of the map.
  vec2 cover(vec2 uv) {
    float canvasA = uRes.x / uRes.y;
    float imgA = uTexAspect.x / uTexAspect.y;
    vec2 s = canvasA > imgA ? vec2(1.0, imgA / canvasA) : vec2(canvasA / imgA, 1.0);
    return (uv - 0.5) * s + 0.5;
  }

  float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

  // One halftone cell: sample at the cell's own centre, not at the fragment,
  // so every dot in a cell agrees on its size. That is what makes it read as
  // a printed screen rather than as a texture of dots.
  float screen(vec2 fragPx, float cellPx) {
    // rot(-a) rather than inverse(): mat2 inverse() is GLSL ES 3.00 only, and
    // these shaders compile as 1.00 wherever WebGL2 is missing.
    vec2 p = rot(ANGLE) * fragPx / cellPx;
    vec2 cell = floor(p) + 0.5;
    vec2 centreUv = cover((rot(-ANGLE) * (cell * cellPx)) / uRes);
    if (centreUv.x < 0.0 || centreUv.x > 1.0 || centreUv.y < 0.0 || centreUv.y > 1.0) return 0.0;

    float l = luma(texture2D(uTex, centreUv).rgb);
    // Levels first. Their frames are shot against a black steel gate and sit
    // almost entirely in the mid-tones; printed straight they come out as an
    // even grey field with no car in it.
    l = smoothstep(0.04, 0.86, l);
    // Negative print: bright pixels get big dots of light ink.
    float r = sqrt(clamp(l, 0.0, 1.0)) * 0.62;
    float d = length(p - cell);
    // A fixed edge in cell units rather than fwidth(): derivatives need an
    // extension under WebGL1, and one cell is always one device pixel wide
    // over cellPx, so the softness is known without asking.
    float aa = 1.4 / cellPx;
    return smoothstep(r + aa, r - aa, d);
  }

  void main() {
    vec2 fragPx = vUv * uRes;

    float base = mix(FINE, COARSE, uCoarse);
    float coarseDots = screen(fragPx, base);
    float fineDots = screen(fragPx, FINE);

    // The loupe: a soft mask that swaps in the fine screen locally.
    float dist = length((vUv - uPointer) * vec2(uRes.x / uRes.y, 1.0));
    float loupe = uPointerOn * (1.0 - smoothstep(0.06, 0.22, dist));

    float dots = mix(coarseDots, fineDots, loupe);

    // The print-in: the screen fills from the left, one column of cells at a
    // time, so the image arrives the way a plate lays ink down.
    float printed = step(vUv.x, uReveal * 1.08);
    dots *= printed;

    gl_FragColor = vec4(mix(uGround, uInk, dots), 1.0);
  }
`;

function Screen({
  src,
  coarse,
  ink,
  ground,
  hostRef,
}: {
  src: string;
  coarse: number;
  ink: string;
  ground: string;
  /** The DOM box the pointer is measured against — one per screen, so two
      screens on a page do not both read the first one's rect. */
  hostRef: RefObject<HTMLDivElement | null>;
}) {
  const tex = useTexture(src);
  const size = useThree((s) => s.size);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef({ x: 0.5, y: 0.5, on: 0 });
  const reveal = useRef(0);
  const coarseRef = useRef(coarse);

  const uniforms = useMemo(
    () => ({
      uTex: { value: null as THREE.Texture | null },
      uTexAspect: { value: new THREE.Vector2(1, 1) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uCoarse: { value: coarse },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uPointerOn: { value: 0 },
      uReveal: { value: 0 },
      uInk: { value: new THREE.Color(ink) },
      uGround: { value: new THREE.Color(ground) },
    }),
    // Colours are read once and the object must stay stable: coarseness and
    // the print-in are both driven from the frame loop, and rebuilding the
    // uniforms mid-life would reset them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ink, ground],
  );

  // Refs cannot be written during render, so the frame loop's copy of the
  // coarseness is synced here instead.
  useEffect(() => {
    coarseRef.current = coarse;
  }, [coarse]);

  // A new car is a new plate: print it in again from the left.
  useEffect(() => {
    reveal.current = 0;
  }, [src]);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.current = {
        x: (e.clientX - r.left) / r.width,
        // GL uv runs up the frame; the DOM runs down it.
        y: 1 - (e.clientY - r.top) / r.height,
        on: 1,
      };
    };
    const leave = () => {
      pointer.current = { ...pointer.current, on: 0 };
    };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [hostRef]);

  useFrame((_, delta) => {
    const m = mat.current;
    if (!m) return;
    const dt = Math.min(delta, 0.05);
    const u = m.uniforms;

    const img = tex.image as { width?: number; height?: number } | undefined;
    if (img) {
      u.uTex.value = tex;
      u.uTexAspect.value.set(img.width ?? 1, img.height ?? 1);
    }
    u.uRes.value.set(size.width, size.height);

    reveal.current += (1 - reveal.current) * (1 - Math.pow(0.02, dt));
    u.uReveal.value = reveal.current;

    // Coarseness eases, so switching cars reads as the screen being re-ruled
    // rather than as a cut.
    u.uCoarse.value += (coarseRef.current - u.uCoarse.value) * (1 - Math.pow(0.02, dt));

    u.uPointer.value.set(pointer.current.x, pointer.current.y);
    u.uPointerOn.value += (pointer.current.on - u.uPointerOn.value) * (1 - Math.pow(0.05, dt));
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * A context the browser refuses outright makes r3f throw on mount, which
 * use-webgl-health cannot see — it only reports a context created and then
 * lost. Probe before rendering the Canvas at all.
 */
function canRenderWebgl() {
  try {
    const c = document.createElement("canvas");
    return Boolean(
      c.getContext("webgl2") ?? c.getContext("webgl") ?? c.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

export function DotScreen({
  src,
  sold,
  alt,
  className,
  ink = "#e9e7e2",
  ground = "#14161a",
}: {
  src: string;
  /** Sold cars print at a coarse screen. The resolution is the status. */
  sold: boolean;
  alt: string;
  className?: string;
  ink?: string;
  ground?: string;
}) {
  const { lost, bind } = useWebglHealth();
  const host = useRef<HTMLDivElement | null>(null);
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    // A browser-only capability answer cannot be known before an effect runs,
    // and a lazy initialiser reading `window` would desync hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(canRenderWebgl());
  }, []);

  if (lost || supported !== true) {
    return (
      <div className={className}>
        <img src={src} alt={alt} className="h-full w-full object-cover grayscale" />
      </div>
    );
  }

  return (
    <div ref={host} className={className} role="img" aria-label={alt}>
      <Canvas
        style={{ width: "100%", height: "100%" }}
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1, left: -1, right: 1, top: 1, bottom: -1 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: false }}
        onCreated={({ gl }) => bind(gl.domElement)}
      >
        <Suspense fallback={null}>
          <Screen src={src} coarse={sold ? 1 : 0} ink={ink} ground={ground} hostRef={host} />
        </Suspense>
      </Canvas>
    </div>
  );
}
