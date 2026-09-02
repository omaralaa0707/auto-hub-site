import type { SiteContent } from "@/i18n/schema";
import { useContent } from "@/i18n/locale-provider";

/**
 * Auto Hub's feed is a record of sales, not a stock list, and its vocabulary
 * is factory codes and one Arabic word. The shared schema has no place for a
 * sold state, for a chassis code, or for a promise made in a hashtag.
 */
export type HubContent = SiteContent & {
  hero: SiteContent["hero"] & {
    screenAlt: string;
    screenHint: string;
    soldLabel: string;
    availableLabel: string;
    postsLabel: string;
    followersLabel: string;
  };
  record: {
    eyebrow: string;
    heading: string;
    intro: string;
    /** States the screen-frequency encoding in words. */
    legend: string;
    soldTag: string;
    availableTag: string;
    filedUnder: string;
    viewPost: string;
    /** Their extra words, glossed. The gloss is this page's. */
    glosses: { term: string; gloss: string }[];
  };
  codes: {
    eyebrow: string;
    heading: string;
    intro: string;
    note: string;
    codeLabel: string;
    modelLabel: string;
  };
  word: {
    eyebrow: string;
    heading: string;
    body: string[];
    /** The hashtag itself, never translated. */
    term: string;
    gloss: string;
    noPrice: string;
  };
  contact: SiteContent["contact"] & {
    emailLabel: string;
    email: string;
    ownerLabel: string;
    owner: string;
  };
};

export function useHub() {
  return useContent() as HubContent;
}
