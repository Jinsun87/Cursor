import type { ReactNode } from "react";

/**
 * One page of the Bible-words glossary (/bible-words/<slug>). Every page is written by hand:
 * the template only supplies the frame (heading, painting, contents, questions, trial box).
 */
export type BibleWord = {
  slug: string;
  /** As headed on the page and listed in the index ("Selah", "Ark of the covenant"). */
  word: string;
  /** Ways to say it in English, stress in capitals ("SEE-lah"). Left out for everyday English words. */
  say?: string[];
  /** The word in the original language: "Hebrew" and the script, with a transliteration when it differs from the English. */
  original: { language: "Hebrew" | "Greek"; script: string; transliteration?: string }[];
  /** The page's <title>; the search phrase people actually type comes first. */
  title: string;
  description: string;
  /** One line for the index card and the DefinedTerm markup. */
  definition: string;
  lead: ReactNode;
  hero: { src: string; alt: string; caption: string };
  sections: { id: string; nav: string; heading: string; body: ReactNode }[];
  faq: { q: string; a: string }[];
  cta: { heading: string; body: ReactNode };
};
