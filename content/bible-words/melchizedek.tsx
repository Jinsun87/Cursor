import { Listen, Verse } from "@/components/study/Scripture";
import type { BibleWord } from "./types";

export const MELCHIZEDEK: BibleWord = {
  slug: "melchizedek",
  word: "Melchizedek",
  say: ["mel-KIZ-uh-dek"],
  original: [{ language: "Hebrew", script: "מַלְכִּי־צֶדֶק", transliteration: "Malki-tsedeq" }],
  title: "Who Was Melchizedek? Meaning, Pronunciation and Bible Verses",
  description:
    "Who was Melchizedek in the Bible? How to pronounce his name and what it means, his meeting with Abraham in Genesis 14, Psalm 110, and why Hebrews calls Jesus a priest in his order.",
  definition: "The king of Salem and priest of God Most High who blessed Abraham in Genesis 14; his name means “king of righteousness”.",
  lead: (
    <>
      He appears for three verses, blesses Abraham, and vanishes. A thousand years later a psalm names him again, and the letter
      to the Hebrews builds a whole chapter on him.
    </>
  ),
  hero: {
    src: "/images/sleep/genesis-14/s3.jpg",
    alt: "A round loaf of bread and a clay cup of wine on a flat stone on a hillside at sunset, the walls of a hilltop city behind",
    caption: "Genesis 14, as painted for Lampstand's reading: the bread and wine Melchizedek brought out, with Salem on the ridge.",
  },
  sections: [
    {
      id: "hear",
      nav: "Hear it",
      heading: "Melchizedek meets Abraham",
      body: (
        <>
          <p>
            Abram, as he was still called, had just rescued his nephew Lot by defeating four kings in a night attack. On his way
            home, two kings came out to meet him. One of them is a mystery:
          </p>
          <Listen book="Genesis" chapter={14} from={17} to={20} />
          <p>
            Abram, the man God had chosen, receives a blessing from Melchizedek and gives him a tenth of everything. In the ancient
            world, that made Melchizedek the greater of the two.
          </p>
        </>
      ),
    },
    {
      id: "name",
      nav: "His name",
      heading: "What his name means",
      body: (
        <>
          <p>
            In Hebrew, <em>malki</em> is &ldquo;my king&rdquo; and <em>tsedeq</em> is &ldquo;righteousness&rdquo;. Hebrews spells
            out both his name and his title:
          </p>
          <Verse book="Hebrews" chapter={7} from={1} to={2} />
          <p>
            Salem is generally identified with Jerusalem; Psalm 76:2 uses Salem as a name for Zion. In English his name is usually
            said mel-KIZ-uh-dek.
          </p>
        </>
      ),
    },
    {
      id: "psalm",
      nav: "Psalm 110",
      heading: "A priest forever: Psalm 110",
      body: (
        <>
          <p>
            Melchizedek is never mentioned again in Genesis. Then, in a psalm of David about a king God seats at His right hand, the
            name returns:
          </p>
          <Listen book="Psalm" chapter={110} from={1} to={4} />
          <p>
            This was startling. Israel&apos;s priests came from the tribe of Levi, and its kings from the tribe of Judah. No one could
            be both. But this king is also a priest, and not of Levi&apos;s line, but of Melchizedek&apos;s, older than Levi
            himself. Psalm 110 is the Old Testament passage most often quoted in the New.
          </p>
        </>
      ),
    },
    {
      id: "jesus",
      nav: "In Hebrews",
      heading: "Jesus, a priest like Melchizedek",
      body: (
        <>
          <p>
            The letter to the Hebrews mentions Melchizedek eleven times, and it sees in him a picture of Jesus. Genesis gives him no
            genealogy, no birth and no death, and Hebrews takes that silence as a sign:
          </p>
          <Verse book="Hebrews" chapter={7} from={3} />
          <p>
            Jesus came from Judah, not Levi, so He could not be a priest of Aaron&apos;s line. But He is a priest of the older,
            greater order, appointed by God&apos;s oath in Psalm 110:
          </p>
          <Verse book="Hebrews" chapter={6} from={20} />
        </>
      ),
    },
  ],
  faq: [
    {
      q: "Who was Melchizedek?",
      a: "The king of Salem and 'priest of God Most High' who met Abraham after his victory over the four kings, brought out bread and wine, blessed him, and received a tenth of everything (Genesis 14:18 to 20).",
    },
    {
      q: "How do you pronounce Melchizedek?",
      a: "In English it is usually said mel-KIZ-uh-dek, with the stress on the second syllable. You can hear it read in Genesis 14 in the clip on this page.",
    },
    {
      q: "What does the name Melchizedek mean?",
      a: "King of righteousness, from the Hebrew malki (my king) and tsedeq (righteousness). As king of Salem he is also 'king of peace' (Hebrews 7:2).",
    },
    {
      q: "Was Melchizedek Jesus?",
      a: "Christians have held different views. Most understand Melchizedek as a real human king whom Scripture presents as a picture of Christ. Hebrews 7:3 says he was 'like the Son of God', which compares the two rather than calling them the same person.",
    },
    {
      q: "What does 'a priest forever in the order of Melchizedek' mean?",
      a: "It comes from Psalm 110:4 and is applied to Jesus in Hebrews 5 to 7. It means Jesus is a priest not by descent from Aaron and Levi, but by God's oath, in an older, royal and eternal priesthood like Melchizedek's.",
    },
    {
      q: "Where can I hear Genesis 14 and Psalm 110 read aloud?",
      a: "In Lampstand, the daily audio Bible. Genesis is free to hear, every chapter, in Walk by day and Sleep by night, and all 150 Psalms are ready too, with the text on screen and a painting for each scene.",
    },
  ],
  cta: {
    heading: "Hear Genesis free, every chapter",
    body: (
      <>
        Lampstand reads the Bible aloud, chapter by chapter: in <strong>Walk</strong>, a clear voice for your day, and in{" "}
        <strong>Sleep</strong>, a slow, quiet reading for the night, with the words on screen and a painting for every scene. Start
        with Abraham&apos;s story in Genesis, and go on to the Psalms.
      </>
    ),
  },
};
