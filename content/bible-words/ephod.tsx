import { Listen, Verse } from "@/components/study/Scripture";
import type { BibleWord } from "./types";

export const EPHOD: BibleWord = {
  slug: "ephod",
  word: "Ephod",
  say: ["EE-fod", "EF-od"],
  original: [{ language: "Hebrew", script: "אֵפוֹד" }],
  title: "Ephod Meaning in the Bible: The High Priest's Garment",
  description:
    "What was an ephod in the Bible? The high priest's ephod in Exodus 28, the onyx stones and the breastpiece, Samuel's and David's linen ephods, and Gideon's ephod.",
  definition: "A sleeveless priestly vest or apron; above all the high priest's ephod of gold, linen and coloured yarn, carrying the names of Israel's tribes.",
  lead: (
    <>
      The high priest went before God wearing the names of all twelve tribes: engraved on two stones on his shoulders and twelve
      more over his heart. They were fastened to a garment called the ephod.
    </>
  ),
  hero: {
    src: "/images/sleep/exodus-28/s1.jpg",
    alt: "Folds of richly woven cloth in blue, purple, scarlet and gold laid on a workshop table beside a loom, lit by an oil lamp",
    caption: "Exodus 28, as painted for Lampstand's reading: the fabrics for the priests' garments.",
  },
  sections: [
    {
      id: "hear",
      nav: "Hear it",
      heading: "How the ephod was made",
      body: (
        <>
          <p>
            Exodus 28 describes the holy garments made for Aaron, the first high priest, &ldquo;to give him glory and
            splendor&rdquo;. The ephod comes first:
          </p>
          <Listen book="Exodus" chapter={28} from={6} to={8} />
        </>
      ),
    },
    {
      id: "meaning",
      nav: "What it was",
      heading: "What an ephod was",
      body: (
        <>
          <p>
            The ephod was a sleeveless outer garment, something like a vest or an apron, held by two shoulder pieces and a woven
            waistband. The high priest wore it over a blue robe. It was woven from fine linen and blue, purple and scarlet yarn,
            the colours of the tabernacle&apos;s inner curtains, with gold worked through it.
          </p>
          <p>Its shoulder pieces each held an onyx stone engraved with six of the tribes of Israel:</p>
          <Listen book="Exodus" chapter={28} from={9} to={12} />
        </>
      ),
    },
    {
      id: "breastpiece",
      nav: "The breastpiece",
      heading: "The breastpiece and the Urim and Thummim",
      body: (
        <>
          <p>
            Fastened to the front of the ephod with gold chains was the breastpiece of judgment, a square of the same fabric set
            with twelve precious stones in four rows, one for each tribe (Exodus 28:15&ndash;21). Inside it were the Urim and
            Thummim, used to seek God&apos;s answer in decisions:
          </p>
          <Verse book="Exodus" chapter={28} from={30} />
          <p>
            So the high priest carried the people twice over: on his shoulders, as if bearing their weight, and over his heart.
          </p>
        </>
      ),
    },
    {
      id: "others",
      nav: "Other ephods",
      heading: "Other ephods in the Bible",
      body: (
        <>
          <p>
            Ordinary priests and others serving God wore a simpler ephod of plain linen. The boy Samuel wore one while serving at the
            tabernacle:
          </p>
          <Verse book="1 Samuel" chapter={2} from={18} />
          <p>And David wore one when he brought the ark into Jerusalem:</p>
          <Verse book="2 Samuel" chapter={6} from={14} />
          <p>
            An ephod could also become an idol. After his victory over Midian, Gideon made an ephod of gold that the people began to
            worship:
          </p>
          <Verse book="Judges" chapter={8} from={27} />
        </>
      ),
    },
  ],
  faq: [
    {
      q: "What was an ephod in the Bible?",
      a: "A sleeveless priestly garment like a vest or apron. The high priest's ephod was made of gold, blue, purple and scarlet yarn and fine linen, with two onyx stones on the shoulders and the breastpiece of judgment fastened to the front (Exodus 28:6 to 30).",
    },
    {
      q: "How do you pronounce ephod?",
      a: "EE-fod or EF-od; both are common in English. You can hear it read in Exodus 28 in the clip on this page.",
    },
    {
      q: "What was written on the ephod?",
      a: "The names of the twelve sons of Israel, six on each of two onyx stones on the shoulder pieces (Exodus 28:9 to 12). The breastpiece attached to it carried twelve more stones, each engraved with the name of one tribe.",
    },
    {
      q: "What were the Urim and Thummim?",
      a: "Objects kept in the breastpiece over the high priest's heart, used to seek God's decision (Exodus 28:30). The Bible does not describe what they looked like or exactly how they were used.",
    },
    {
      q: "Why did David wear a linen ephod?",
      a: "When David brought the ark of the covenant into Jerusalem he 'danced with all his might before the LORD', wearing a simple linen ephod (2 Samuel 6:14), the garment of someone serving before God, rather than his royal robes.",
    },
    {
      q: "Where can I hear Exodus 28 read aloud?",
      a: "In Lampstand, the daily audio Bible. All 40 chapters of Exodus are read aloud in Walk by day and Sleep by night, with the text on screen and a painting for each scene. Genesis is free to hear, every chapter.",
    },
  ],
  cta: {
    heading: "Hear Exodus, chapter by chapter",
    body: (
      <>
        Lampstand reads the Bible aloud, chapter by chapter: in <strong>Walk</strong>, a clear voice for your day, and in{" "}
        <strong>Sleep</strong>, a slow, quiet reading for the night, with the words on screen and a painting for every scene. All 40
        chapters of Exodus are ready to hear.
      </>
    ),
  },
};
