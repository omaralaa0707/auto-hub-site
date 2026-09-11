# Auto Hub Egypt — site 20 of 46

A concept site built entirely from this dealership's own published material.
**Not affiliated with Auto Hub Egypt, and not an official site.**

- **Live:** https://auto-hub-site.vercel.app
- **Repo:** [auto-hub-site](https://github.com/omaralaa0707/auto-hub-site)

## What this page is about

Every site in this series is built around something true and checkable about
the dealer's own account — a pattern in what they publish, a contradiction
between two of their channels, or a fact about their showroom — rather than
around a generic template. The palette, type, 3D piece and motion below were
all chosen to serve that finding.

## Design record

**Palette**
: **One ink on one ground and no accent colour at all** — charcoal #14161A from the black steel gate every car of theirs is photographed against, and #E9E7E2 from the grey interlock paving they stand on. Nothing on the page is marked with colour because nothing in their captions is

**Type pairing**
: Epilogue + Newsreader (a **serif body face**, the first in the set) / Mirza + Lemonada (AR)

**3D / signature technique**
: **The halftone screen**: a real 15°-rotated dot screen in one fragment program — one sample per cell taken at the cell's own centre, dot radius from that cell's luminance, printed as light ink on charcoal. **Screen frequency is the data channel**: a car still listed prints fine and reads sharply, a car marked #sold prints coarse so you see the grid before you see the car. The pointer is a *loupe of resolution*, mixing a second fine screen in locally rather than magnifying

**Motion language**
: The register — a block lands out of register, offset and soft, and the plates converge onto true in 420ms. Hard and short, no overshoot, mirrored per locale: a press either hits the sheet or it does not

## Sources

Everything on the page was sourced from:

- Instagram: https://www.instagram.com/auto.hub.egypt/ (unverified - multiple candidates)
- Facebook: https://www.facebook.com/AutoHubEgy/

Photography belongs to the dealership (or, where their frames are watermarked
by an outside studio, to that studio) and is used here only to document their
own published material. No figure on the page is invented: anything the dealer
did not publish is marked as unpublished rather than estimated.

## Running it

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build — must pass before shipping
pnpm lint     # eslint, zero warnings
```

Requires `node-linker=hoisted` in `.npmrc` (already present) or three.js peer
deps fail to resolve.

## Structure

```
src/content/media.ts      verified facts and figures — the data layer
src/content/en.ts|ar.ts   all copy, both locales, identical shapes
src/content/schema-ext.ts the page-specific content contract
src/components/webgl/     the 3D piece
src/components/site/      the page composition
src/app/globals.css       palette tokens, type, RTL overrides, motion
```

Arabic/English toggle with full RTL. All CSS direction overrides key off
`[dir="rtl"]` (never `[lang]`) and live outside `@layer`. Every Latin or
numeric fragment inside Arabic copy is wrapped in `.latin` for correct bidi.

---

Part of a 46-site series. See the [top-level README](../README.md) for the full
index and [`TRACKING.md`](../TRACKING.md) for the differentiation log.
