import { AMEN } from "./amen";
import { ARK_OF_THE_COVENANT } from "./ark-of-the-covenant";
import { CHERUBIM } from "./cherubim";
import { COVENANT } from "./covenant";
import { EPHOD } from "./ephod";
import { GLORY } from "./glory";
import { GRACE } from "./grace";
import { HALLELUJAH } from "./hallelujah";
import { HOSANNA } from "./hosanna";
import { KINSMAN_REDEEMER } from "./kinsman-redeemer";
import { MANNA } from "./manna";
import { MASKIL } from "./maskil";
import { MELCHIZEDEK } from "./melchizedek";
import { SELAH } from "./selah";
import { TABERNACLE } from "./tabernacle";
import type { BibleWord } from "./types";

/** The glossary, A to Z. Add words slowly and by hand: each page must stand on its own. */
export const BIBLE_WORDS: BibleWord[] = [
  AMEN,
  ARK_OF_THE_COVENANT,
  CHERUBIM,
  COVENANT,
  EPHOD,
  GLORY,
  GRACE,
  HALLELUJAH,
  HOSANNA,
  KINSMAN_REDEEMER,
  MANNA,
  MASKIL,
  MELCHIZEDEK,
  SELAH,
  TABERNACLE,
];

export function getBibleWord(slug: string) {
  return BIBLE_WORDS.find((w) => w.slug === slug);
}
