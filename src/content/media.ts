/**
 * Auto Hub Egypt publish 71 posts to 104 followers, and the captions are all
 * one sentence long. Two things in them are worth a whole site.
 *
 * The first is `#sold`. Seven of their last twelve posts carry it. This is not
 * a shop window — it is a record of what has already gone, kept in public.
 *
 * The second is how they name things. The German saloons are identified by
 * factory code — W205, F10, G30, W213 — the way an owner or a workshop would,
 * not the way a salesman would. Everything else gets its model name. That
 * split is theirs, and it is the whole voice of the account.
 *
 * There are no prices anywhere, no specifications, and one Arabic word:
 * تقسيط — instalments — on every single post.
 */

export type CarId =
  | "c180"
  | "520i"
  | "520"
  | "e200"
  | "leon"
  | "rx5"
  | "cla"
  | "sandero"
  | "karoq"
  | "a5"
  | "crossland"
  | "giulietta";

export type Car = {
  id: CarId;
  marque: string;
  model: string;
  /** Only when they wrote one. */
  year?: string;
  /** Their trim word, verbatim. */
  trim?: string;
  /**
   * The tag they filed it under. `chassis: true` marks the four they gave a
   * factory code rather than a model name.
   */
  tag: string;
  chassis: boolean;
  sold: boolean;
  /** Anything else the caption said, verbatim and nothing added. */
  extra?: string;
  frames: string[];
  postUrl: string;
};

const post = (code: string) => `https://www.instagram.com/p/${code}/`;
const f = (s: string) => [1, 2, 3].map((i) => `/media/${s}-${i}.jpg`);

/** In their order, newest first — the order the record was written in. */
export const CARS: Car[] = [
  {
    id: "c180",
    marque: "Mercedes",
    model: "C180 Avantgarde",
    year: "2015",
    trim: "Avantgarde",
    tag: "W205",
    chassis: true,
    sold: false,
    frames: f("c180"),
    postUrl: post("DVXfpWYCA-J"),
  },
  {
    id: "520i",
    marque: "BMW",
    model: "520i",
    year: "2016",
    tag: "F10",
    chassis: true,
    sold: true,
    frames: f("520i"),
    postUrl: post("DVXfYgqiFYJ"),
  },
  {
    id: "520",
    marque: "BMW",
    model: "520",
    year: "2019",
    tag: "G30",
    chassis: true,
    sold: true,
    frames: f("520"),
    postUrl: post("DVXfFNrCEVg"),
  },
  {
    id: "e200",
    marque: "Mercedes",
    model: "E200 Sport / Avantgarde",
    trim: "Sport / Avantgarde",
    tag: "W213",
    chassis: true,
    sold: false,
    extra: "Wakeel",
    frames: f("e200"),
    postUrl: post("DUjrPTriC6p"),
  },
  {
    id: "leon",
    marque: "SEAT",
    model: "Leon FR",
    year: "2021",
    trim: "FR",
    tag: "Leon",
    chassis: false,
    sold: false,
    frames: f("leon"),
    postUrl: post("DUbGM6jDZIn"),
  },
  {
    id: "rx5",
    marque: "MG",
    model: "RX5 Luxury",
    year: "2019",
    trim: "Luxury",
    tag: "RX5",
    chassis: false,
    sold: true,
    frames: f("rx5"),
    postUrl: post("DUZuXVuCOju"),
  },
  {
    id: "cla",
    marque: "Mercedes",
    model: "CLA Luxury",
    year: "2022",
    trim: "Luxury",
    tag: "CLA",
    chassis: false,
    sold: true,
    extra: "Wakeel",
    frames: f("cla"),
    postUrl: post("DUZuDJ_iFHw"),
  },
  {
    id: "sandero",
    marque: "Renault",
    model: "Sandero",
    year: "2019",
    tag: "Sandero",
    chassis: false,
    sold: true,
    frames: f("sandero"),
    postUrl: post("DTdUHELjefO"),
  },
  {
    id: "karoq",
    marque: "Skoda",
    model: "Karoq",
    year: "2026",
    tag: "Karoq",
    chassis: false,
    sold: false,
    extra: "ONLY 650km",
    frames: f("karoq"),
    postUrl: post("DTYssckDda1"),
  },
  {
    id: "a5",
    marque: "Audi",
    model: "A5 S-Line",
    year: "2024",
    trim: "S-Line",
    tag: "A5",
    chassis: false,
    sold: true,
    frames: f("a5"),
    postUrl: post("DTROCcHiAzF"),
  },
  {
    id: "crossland",
    marque: "Opel",
    model: "Cross-Land Top-Line",
    year: "2024",
    trim: "Top-Line",
    tag: "Crossland",
    chassis: false,
    sold: true,
    frames: f("crossland"),
    postUrl: post("DTRMxYnDMXD"),
  },
  {
    id: "giulietta",
    marque: "Alfa Romeo",
    model: "Giulietta QV",
    trim: "QV",
    tag: "Giulietta",
    chassis: false,
    sold: false,
    extra: "180hp",
    frames: f("giulietta"),
    postUrl: post("DS5QPV6jTZ_"),
  },
];

export const SOLD = CARS.filter((c) => c.sold).length;
export const AVAILABLE = CARS.length - SOLD;
/** The four they filed under a factory code rather than a model name. */
export const CHASSIS = CARS.filter((c) => c.chassis);

/** The frame the hero screen is printed from. */
export const HERO_FRAME = "/media/e200-1.jpg";

export const PROFILE = {
  instagram: "https://www.instagram.com/auto.hub.egypt/",
  facebook: "https://www.facebook.com/AutoHubEgy/",
  maps: "https://www.google.com/maps/search/?api=1&query=64+Nehru+Street+Heliopolis+Cairo",
  phone: "01226515617",
  phoneHref: "tel:+201226515617",
  email: "Autohub.egy@gmail.com",
  /** Their own words, from the Facebook page's Intro. */
  intro:
    "Our goal is to provide the market with the best & lowest prices for Brand-New & Pre-Owned Vehicles.",
  owner: "م. محمد الديب",
  address: "64 Nehru St, off Al Sebaq St — behind Merryland Park, Heliopolis, Cairo",
  addressAr: "٦٤ ش نهرو من ش السباق، خلف حديقة الميريلاند، مصر الجديدة، القاهرة",
  igFollowers: "104",
  igPosts: "71",
  fbFollowers: "1K",
} as const;
