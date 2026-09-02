import type { HubContent } from "./schema-ext";
import { PROFILE } from "./media";

export const en: HubContent = {
  locale: "en",
  dir: "ltr",

  brand: {
    name: "Auto Hub",
    shortName: "AH",
    tagline: "Brand-new & pre-owned",
  },

  nav: [
    { label: "The record", href: "#record" },
    { label: "The codes", href: "#codes" },
    { label: "One word", href: "#word" },
  ],

  hero: {
    eyebrow: "Heliopolis, Cairo",
    headline: "Seven of the last twelve have already gone",
    sub: "Auto Hub keep a public record rather than a shop window. Most of what they post is marked sold and left up, so the feed reads as a history of what moved through the gate — which is a more useful thing to be shown than a catalogue.",
    primaryCta: "Call Auto Hub",
    secondaryCta: "Read the record",
    screenAlt:
      "A car from Auto Hub's feed, printed as a halftone screen in white ink on charcoal.",
    screenHint: "Move over the print to raise the screen under your pointer.",
    soldLabel: "Sold",
    availableLabel: "Still listed",
    postsLabel: "Posts",
    followersLabel: "Followers",
  },

  about: {
    heading: "Auto Hub Egypt",
    body: [PROFILE.intro],
  },

  services: { heading: "The record", items: [] },
  gallery: { heading: "The record", items: [] },

  record: {
    eyebrow: "The record",
    heading: "Twelve entries, in the order they were written",
    intro:
      "Every one of these is a single-sentence post. No price, no mileage, no specification — a marque, a model, usually a year, sometimes a trim word, and a tag. What follows is exactly that and nothing more.",
    legend:
      "Status is printed, not coloured. Choose an entry and the plate beside it is re-ruled: a car still listed prints at a fine screen and reads sharply, a car that has gone prints coarse, so you see the grid before you see the car. Move your pointer across the plate to raise the screen locally and read a sold one again.",
    soldTag: "Sold",
    availableTag: "Listed",
    filedUnder: "Filed under",
    viewPost: "See the post",
    glosses: [
      { term: "Wakeel", gloss: "Supplied through the local agent, not imported privately." },
      { term: "Avantgarde", gloss: "Mercedes' trim line. Their word, not a description." },
      { term: "S-Line", gloss: "Audi's appearance package." },
      { term: "QV", gloss: "Quadrifoglio Verde — Alfa Romeo's performance badge." },
    ],
  },

  codes: {
    eyebrow: "How they name things",
    heading: "Four of the twelve are filed by factory code",
    intro:
      "The German saloons are not tagged by model. They are tagged W205, F10, G30 and W213 — the codes a workshop or an owner uses, not the ones a forecourt uses. Everything else in the record gets its ordinary name.",
    note: "The split is Auto Hub's. The observation about it is this page's.",
    codeLabel: "Their tag",
    modelLabel: "The car",
  },

  word: {
    eyebrow: "One word",
    heading: "The only Arabic on the account is a promise",
    body: [
      "Every post in the record carries the same four hashtags in the same order, and one of them is Arabic. It is on the Alfa and it is on the Sandero. It is the only thing Auto Hub say about money anywhere.",
      "There is no price on any post, on the profile, or on the Facebook page. What there is, on all seventy-one of them, is this.",
    ],
    term: "تقسيط",
    gloss: "taqseet — instalments",
    noPrice:
      "No figure appears anywhere in their material, so none appears anywhere on this page. Nothing here is estimated, converted or worked out.",
  },

  contact: {
    heading: "Find them",
    addressLabel: "Address",
    address: PROFILE.address,
    phoneLabel: "Call",
    phones: [PROFILE.phone],
    emailLabel: "Email",
    email: PROFILE.email,
    ownerLabel: "Run by",
    owner: PROFILE.owner,
    mapsUrl: PROFILE.maps,
    instagramUrl: PROFILE.instagram,
    facebookUrl: PROFILE.facebook,
    cta: "Call Auto Hub",
  },

  footer: {
    disclaimer:
      "A concept design, built as a demonstration. Not an official Auto Hub Egypt site, and not affiliated with them. All photography, marks and quoted copy belong to Auto Hub Egypt.",
    rights: "Concept by Claude",
  },

  a11y: {
    toggleLanguage: "التبديل إلى العربية",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
};
