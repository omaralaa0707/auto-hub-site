"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";
import { useLocale } from "@/i18n/locale-provider";
import { useHub } from "@/content/schema-ext";
import { AVAILABLE, CARS, CHASSIS, PROFILE, SOLD, type Car } from "@/content/media";
import { DotScreen } from "@/components/webgl/dot-screen";

/* ---------------------------------------------------------------- motion -- */

function useOnScreen<T extends HTMLElement>(rootMargin = "-6% 0px -6% 0px") {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reveal = () => node.setAttribute("data-seen", "");
    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          reveal();
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [rootMargin]);
  return ref;
}

const delayVar = (d: number) => ({ "--reg-delay": `${d}ms` }) as CSSProperties;

/**
 * This site's arrival: the register. A block lands slightly off, out of
 * register and soft, and the plates converge onto true. Short and hard —
 * a press either hits the sheet or it does not.
 */
function Reg({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const ref = useOnScreen<HTMLElement>();
  // A polymorphic tag's prop union is too wide for TS to resolve on its own.
  const C = Tag as unknown as (p: Record<string, unknown>) => ReactElement;
  return (
    <C ref={ref} data-reg="" className={className} style={delayVar(delay)}>
      {children}
    </C>
  );
}

function Rule({ className, delay = 0 }: { className?: string; delay?: number }) {
  const ref = useOnScreen<HTMLDivElement>();
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-rule=""
      className={`h-px w-full origin-[left_center] bg-ink/25 rtl:origin-[right_center] ${className ?? ""}`}
      style={delayVar(delay)}
    />
  );
}

function SectionHead({
  eyebrow,
  heading,
  intro,
}: {
  eyebrow: string;
  heading: string;
  intro?: string;
}) {
  return (
    <div>
      <Reg className="label text-ink-3">{eyebrow}</Reg>
      <Reg as="h2" className="text-display font-display mt-3 max-w-[24ch] text-ink" delay={70}>
        {heading}
      </Reg>
      <Rule className="mt-6" delay={130} />
      {intro ? (
        <Reg className="text-lead mt-6 max-w-[68ch] leading-[1.8] text-ink-2" delay={180}>
          {intro}
        </Reg>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------- nav -- */

export function Nav() {
  const c = useHub();
  const { locale, toggleLocale } = useLocale();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/12 bg-plate/92 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[86rem] items-center gap-5 px-5 sm:px-8">
        <a href="#top" className="flex shrink-0 items-center gap-2.5" aria-label={c.brand.name}>
          <img src="/mark.svg" alt="" className="h-7 w-7" />
          <span className="font-display text-[0.98rem] font-semibold tracking-wide text-ink">
            {c.brand.name}
          </span>
        </a>

        <nav className="ms-auto hidden items-center gap-7 md:flex">
          {c.nav.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="py-2 text-[0.88rem] text-ink-2 transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href={PROFILE.phoneHref}
          className="latin tnum ms-auto shrink-0 text-[0.86rem] font-semibold text-ink transition-opacity hover:opacity-75 md:ms-0"
        >
          {PROFILE.phone}
        </a>

        <button
          onClick={toggleLocale}
          className="shrink-0 border border-ink/30 px-3 py-1.5 text-[0.7rem] text-ink-2 transition-colors hover:border-ink hover:text-ink"
          aria-label={c.a11y.toggleLanguage}
        >
          {locale === "ar" ? "EN" : "ع"}
        </button>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------ the record -- */

/**
 * One entry, printed. Selecting it re-rules the big screen above; the entry's
 * own status is carried by the screen's coarseness rather than by any colour,
 * which is the whole point of the page.
 */
function Entry({
  car,
  index,
  selected,
  onSelect,
}: {
  car: Car;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const c = useHub();

  return (
    <Reg as="li" delay={Math.min(index, 6) * 45}>
      <button
        onClick={onSelect}
        aria-pressed={selected}
        className={`group grid w-full grid-cols-[2.6rem_1fr_auto] items-baseline gap-4 border-b px-1 py-4 text-start transition-colors sm:grid-cols-[3rem_1fr_9rem_auto] ${
          selected ? "border-ink/60 bg-plate-2" : "border-ink/12 hover:bg-plate-2/60"
        }`}
      >
        <span className="code tnum text-[0.78rem] text-ink-3">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="min-w-0">
          <span className="latin block text-[1.02rem] font-medium text-ink">
            {car.marque} {car.model}
          </span>
          <span className="fine mt-1 block text-ink-3">
            <span className="latin">{car.tag}</span>
            {car.extra ? (
              <>
                {" · "}
                <span className="latin">{car.extra}</span>
              </>
            ) : null}
          </span>
        </span>

        <span className="code tnum hidden text-[0.86rem] text-ink-2 sm:block">
          {car.year ?? "—"}
        </span>

        {/* Status is a word, not a colour: the page has no accent to spend. */}
        <span
          className={`label whitespace-nowrap ${car.sold ? "text-ink-3" : "text-ink"}`}
        >
          {car.sold ? c.record.soldTag : c.record.availableTag}
        </span>
      </button>
    </Reg>
  );
}

function Record({
  selected,
  setSelected,
}: {
  selected: number;
  setSelected: (i: number) => void;
}) {
  const c = useHub();
  const car = CARS[selected];

  return (
    <section id="record" className="mx-auto max-w-[86rem] px-5 py-24 sm:px-8 sm:py-28">
      <SectionHead
        eyebrow={c.record.eyebrow}
        heading={c.record.heading}
        intro={c.record.intro}
      />

      <Reg className="fine mt-6 max-w-[68ch] border-s-2 border-ink/40 ps-4 text-ink-3" delay={240}>
        {c.record.legend}
      </Reg>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        {/* The plate stays with the list, so choosing an entry re-rules
            something you can still see. */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Reg>
            <DotScreen
              src={car.frames[0]}
              sold={car.sold}
              alt={c.hero.screenAlt}
              className="aspect-[4/3] w-full border border-ink/20"
            />
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
              <span className="latin text-[0.98rem] text-ink">
                {car.marque} {car.model}
                {car.year ? ` \u00b7 ${car.year}` : ""}
              </span>
              <span className="label text-ink-3">
                {car.sold ? c.record.soldTag : c.record.availableTag}
              </span>
            </div>
            <div className="fine mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-ink-3">
              <span>
                {c.record.filedUnder} <span className="latin">{car.tag}</span>
              </span>
              <a
                href={car.postUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-ink underline decoration-ink/40 underline-offset-4"
              >
                {c.record.viewPost}
              </a>
            </div>
            <p className="fine mt-2 text-ink-3">{c.hero.screenHint}</p>
          </Reg>
        </div>

        <ul>
          {CARS.map((entry, i) => (
            <Entry
              key={entry.id}
              car={entry}
              index={i}
              selected={i === selected}
              onSelect={() => setSelected(i)}
            />
          ))}
        </ul>
      </div>

      <Reg className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4" delay={80}>
        {c.record.glosses.map((g) => (
          <div key={g.term} className="border-t border-ink/20 pt-4">
            <div className="latin text-[0.94rem] font-semibold text-ink">{g.term}</div>
            <p className="fine mt-1.5 text-ink-3">{g.gloss}</p>
          </div>
        ))}
      </Reg>
    </section>
  );
}

/* ------------------------------------------------------------- the codes -- */

function Codes() {
  const c = useHub();

  return (
    <section id="codes" className="border-y border-ink/12 bg-plate-2 py-24 sm:py-28">
      <div className="mx-auto max-w-[86rem] px-5 sm:px-8">
        <SectionHead eyebrow={c.codes.eyebrow} heading={c.codes.heading} intro={c.codes.intro} />

        <div className="mt-14 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {CHASSIS.map((car, i) => (
            <Reg key={car.id} className="bg-plate-3 p-6" delay={i * 70}>
              <div className="label text-ink-3">{c.codes.codeLabel}</div>
              <div className="code mt-2 text-[2.4rem] leading-none text-ink">
                <span className="latin">{car.tag}</span>
              </div>
              <div className="label mt-7 text-ink-3">{c.codes.modelLabel}</div>
              <div className="latin mt-1.5 text-[0.98rem] text-ink-2">
                {car.marque} {car.model}
              </div>
              <div className="fine mt-4 text-ink-3">
                {car.sold ? c.record.soldTag : c.record.availableTag}
                {car.year ? (
                  <>
                    {" · "}
                    <span className="latin tnum">{car.year}</span>
                  </>
                ) : null}
              </div>
            </Reg>
          ))}
        </div>

        <Reg className="fine mt-8 max-w-[60ch] text-ink-3" delay={320}>
          {c.codes.note}
        </Reg>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- one word -- */

function Word() {
  const c = useHub();

  return (
    <section id="word" className="mx-auto max-w-[86rem] px-5 py-24 sm:px-8 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <Reg className="label text-ink-3">{c.word.eyebrow}</Reg>
          <Reg as="h2" className="text-display font-display mt-3 max-w-[20ch] text-ink" delay={70}>
            {c.word.heading}
          </Reg>
          <Rule className="mt-6" delay={130} />
          {c.word.body.map((p, i) => (
            <Reg
              key={p.slice(0, 24)}
              className="text-lead mt-6 max-w-[54ch] leading-[1.85] text-ink-2"
              delay={180 + i * 80}
            >
              {p}
            </Reg>
          ))}
        </div>

        <Reg className="flex flex-col justify-center border border-ink/20 p-8 sm:p-12" delay={140}>
          {/* Their word, at the size they never set it: kept in Arabic in both
              locales and glossed rather than translated away. */}
          <div
            dir="rtl"
            lang="ar"
            className="font-display text-[clamp(3.4rem,11vw,7rem)] leading-none text-ink"
            style={{ fontFamily: "var(--font-arabic-display)" }}
          >
            {c.word.term}
          </div>
          <div className="fine mt-5 text-ink-2">{c.word.gloss}</div>
          <div className="mt-8 border-t border-ink/20 pt-5">
            <p className="fine text-ink-3">{c.word.noPrice}</p>
          </div>
        </Reg>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- hero -- */

/** The first sold entry in the record: the hero prints what "gone" looks
    like, rather than the shop-window frame every other site opens with. */
const HERO_CAR = CARS.find((x) => x.sold) ?? CARS[0];

function Hero() {
  const c = useHub();
  const car = HERO_CAR;

  return (
    <section id="top" className="relative pt-16">
      <div className="mx-auto max-w-[86rem] px-5 pt-12 sm:px-8 lg:pt-16">
        <Reg className="label text-ink-3">{c.hero.eyebrow}</Reg>
        <Reg as="h1" className="text-hero font-display mt-4 max-w-[19ch] text-ink" delay={90}>
          {c.hero.headline}
        </Reg>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          {/* The screen. Its coarseness is the selected entry's status. */}
          <Reg delay={40}>
            <DotScreen
              src={car.frames[0]}
              sold={car.sold}
              alt={c.hero.screenAlt}
              className="aspect-[4/3] w-full border border-ink/20"
            />
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
              <span className="latin text-[0.98rem] text-ink">
                {car.marque} {car.model}
                {car.year ? ` · ${car.year}` : ""}
              </span>
              <span className="label text-ink-3">
                {car.sold ? c.record.soldTag : c.record.availableTag}
              </span>
            </div>
            <p className="fine mt-1 text-ink-3">{c.hero.screenHint}</p>
          </Reg>

          <div>
            <Reg className="text-lead max-w-[48ch] leading-[1.85] text-ink-2" delay={160}>
              {c.hero.sub}
            </Reg>

            <Reg className="mt-9 flex flex-wrap items-center gap-3" delay={240}>
              <a
                href={PROFILE.phoneHref}
                className="bg-ink px-6 py-3 text-[0.9rem] font-medium text-plate transition-opacity hover:opacity-85"
              >
                {c.hero.primaryCta}
              </a>
              <a
                href="#record"
                className="border border-ink/35 px-6 py-3 text-[0.9rem] text-ink transition-colors hover:border-ink"
              >
                {c.hero.secondaryCta}
              </a>
            </Reg>

            <Reg className="mt-12 grid grid-cols-2 gap-px border-t border-ink/20" delay={320}>
              {[
                { k: c.hero.soldLabel, v: String(SOLD) },
                { k: c.hero.availableLabel, v: String(AVAILABLE) },
                { k: c.hero.postsLabel, v: PROFILE.igPosts },
                { k: c.hero.followersLabel, v: PROFILE.igFollowers },
              ].map((s) => (
                <div key={s.k} className="pt-6">
                  <div className="code tnum text-[2rem] leading-none text-ink">{s.v}</div>
                  <div className="label mt-2 text-ink-3">{s.k}</div>
                </div>
              ))}
            </Reg>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- contact -- */

function Contact() {
  const c = useHub();

  return (
    <section id="contact" className="border-t border-ink/12 bg-plate-2 py-24 sm:py-28">
      <div className="mx-auto max-w-[86rem] px-5 sm:px-8">
        <Reg as="h2" className="text-display font-display max-w-[16ch] text-ink">
          {c.contact.heading}
        </Reg>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <Reg delay={60}>
            <div className="label text-ink-3">{c.contact.addressLabel}</div>
            <p className="mt-3 text-[0.94rem] leading-relaxed text-ink-2">{c.contact.address}</p>
            <a
              href={c.contact.mapsUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="fine mt-3 inline-block text-ink underline decoration-ink/40 underline-offset-4"
            >
              Google Maps
            </a>
          </Reg>

          <Reg delay={130}>
            <div className="label text-ink-3">{c.contact.phoneLabel}</div>
            <a
              href={PROFILE.phoneHref}
              className="latin tnum mt-3 block text-[1.05rem] text-ink transition-opacity hover:opacity-75"
            >
              {c.contact.phones[0]}
            </a>
            <div className="label mt-6 text-ink-3">{c.contact.emailLabel}</div>
            <a
              href={`mailto:${c.contact.email}`}
              className="latin mt-2 block text-[0.9rem] text-ink-2 transition-colors hover:text-ink"
            >
              {c.contact.email}
            </a>
          </Reg>

          <Reg delay={200}>
            <div className="label text-ink-3">{c.contact.ownerLabel}</div>
            <p className="mt-3 text-[0.96rem] text-ink-2">{c.contact.owner}</p>
            <div className="mt-6 flex flex-col gap-2 text-[0.9rem]">
              <a
                href={c.contact.instagramUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-ink-2 underline decoration-ink/30 underline-offset-4 transition-colors hover:text-ink"
              >
                Instagram
              </a>
              <a
                href={c.contact.facebookUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-ink-2 underline decoration-ink/30 underline-offset-4 transition-colors hover:text-ink"
              >
                Facebook
              </a>
            </div>
          </Reg>

          <Reg delay={270}>
            <a
              href={PROFILE.phoneHref}
              className="inline-block bg-ink px-6 py-3 text-[0.9rem] font-medium text-plate transition-opacity hover:opacity-85"
            >
              {c.contact.cta}
            </a>
          </Reg>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- export -- */

export function Sections() {
  // The record and the hero screen are one control: choosing an entry
  // re-rules the plate above it.
  const [selected, setSelected] = useState(0);

  return (
    <main>
      <Hero />
      <Record selected={selected} setSelected={setSelected} />
      <Codes />
      <Word />
      <Contact />
    </main>
  );
}

export function Footer() {
  const c = useHub();

  return (
    <footer className="border-t border-ink/12 bg-plate py-10">
      <div className="mx-auto flex max-w-[86rem] flex-col gap-5 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/mark.svg" alt="" className="h-6 w-6" />
          <span className="font-display text-[0.94rem] font-semibold text-ink">{c.brand.name}</span>
          <span className="fine text-ink-3">{c.brand.tagline}</span>
        </div>
        <p className="fine max-w-[64ch] text-ink-3">{c.footer.disclaimer}</p>
        <p className="fine text-ink-3">{c.footer.rights}</p>
      </div>
    </footer>
  );
}
