import { Listen, Verse } from "@/components/study/Scripture";
import type { BibleWord } from "./types";

export const TABERNACLE: BibleWord = {
  slug: "tabernacle",
  word: "Tabernacle",
  say: ["TAB-er-nak-ul"],
  original: [{ language: "Hebrew", script: "מִשְׁכָּן", transliteration: "mishkan" }],
  title: "Tabernacle Meaning in the Bible: God's Tent Among His People",
  description:
    "What was the tabernacle in the Bible? Its meaning, its layout and furniture, the day God's glory filled it, and why John says the Word “tabernacled” among us.",
  definition: "The portable tent sanctuary Israel built in the wilderness, where God dwelt among His people; in Hebrew, “dwelling place”.",
  lead: (
    <>
      The God who made the heavens asked for a tent. For forty years in the wilderness, the tabernacle stood at the centre of
      Israel&apos;s camp, and God lived among His people in it.
    </>
  ),
  hero: {
    src: "/images/sleep/exodus-40/s3.jpg",
    alt: "A tent sanctuary glowing with golden light from within, a pillar of cloud rising above it at night, people standing among the tents of the camp",
    caption: "Exodus 40, as painted for Lampstand's reading: the cloud covers the tent and the glory fills the tabernacle.",
  },
  sections: [
    {
      id: "hear",
      nav: "Hear it",
      heading: "The day God moved in",
      body: (
        <>
          <p>
            Exodus spends thirteen chapters on the tabernacle&apos;s design and building. Then, in the final verses of the book,
            Moses finishes the work:
          </p>
          <Listen book="Exodus" chapter={40} from={33} to={38} />
        </>
      ),
    },
    {
      id: "meaning",
      nav: "What it means",
      heading: "What tabernacle means",
      body: (
        <>
          <p>
            The Hebrew <em>mishkan</em> means simply &ldquo;dwelling place&rdquo;. The English word comes from the Latin{" "}
            <em>tabernaculum</em>, a tent or hut. It is also called the Tent of Meeting, because it was where God met with Moses
            and the people.
          </p>
          <p>The purpose is stated in the first instruction God gives for it:</p>
          <Verse book="Exodus" chapter={25} from={8} to={9} />
          <p>
            That is the whole point. Not a monument, but a home: the holy God living in the middle of an ordinary camp of tents.
          </p>
        </>
      ),
    },
    {
      id: "layout",
      nav: "Inside",
      heading: "Inside the tabernacle",
      body: (
        <>
          <p>It was built in three zones, each holier than the last:</p>
          <ul className="ls-points">
            <li>
              <strong>The courtyard</strong>, a fenced enclosure of linen curtains, with the bronze altar for sacrifices and the
              bronze basin where the priests washed.
            </li>
            <li>
              <strong>The Holy Place</strong>, the first room of the tent, with the table for the bread of the Presence, the golden{" "}
              <a href="/lampstand-in-the-bible">lampstand</a> and the altar of incense.
            </li>
            <li>
              <strong>The Most Holy Place</strong>, behind a veil embroidered with cherubim, holding only the{" "}
              <a href="/bible-words/ark-of-the-covenant">ark of the covenant</a>. Only the high priest could enter, once a year.
            </li>
          </ul>
          <p>
            It was designed to be carried. When the cloud lifted, the Levites took it down and the whole nation moved; when the cloud
            settled, they set it up again.
          </p>
        </>
      ),
    },
    {
      id: "jesus",
      nav: "In John",
      heading: "The Word who tabernacled among us",
      body: (
        <>
          <p>
            John chose his words carefully when he described Jesus coming into the world. The Greek verb translated &ldquo;made His
            dwelling&rdquo; means to pitch a tent, the same idea as the tabernacle. And in the next breath he mentions glory, just as
            Exodus does:
          </p>
          <Verse book="John" chapter={1} from={14} />
          <p>
            The tabernacle was God living among His people in a tent. In Jesus, John says, God came to live among us in a human
            body.
          </p>
        </>
      ),
    },
  ],
  faq: [
    {
      q: "What was the tabernacle in the Bible?",
      a: "A portable tent sanctuary Israel built at Mount Sinai, following God's instructions in Exodus 25 to 31 and 35 to 40. It was where God dwelt among His people during their journey through the wilderness and into Canaan.",
    },
    {
      q: "What does the word tabernacle mean?",
      a: "The Hebrew mishkan means 'dwelling place.' The English comes from the Latin tabernaculum, meaning a tent. God's stated purpose was 'so that I may dwell among them' (Exodus 25:8).",
    },
    {
      q: "What was inside the tabernacle?",
      a: "In the Holy Place: the table for the bread of the Presence, the golden lampstand and the altar of incense. In the Most Holy Place: the ark of the covenant with its mercy seat. In the courtyard outside: the bronze altar and the bronze basin.",
    },
    {
      q: "Is the tabernacle the same as the temple?",
      a: "No, though they served the same purpose. The tabernacle was a tent that moved with Israel. Solomon later built the temple in Jerusalem as a permanent house for God, following the same basic plan.",
    },
    {
      q: "What does it mean that Jesus tabernacled among us?",
      a: "John 1:14 says the Word 'made His dwelling among us.' The Greek verb means to pitch a tent, recalling the tabernacle: as God once lived among Israel in a tent, He came to live among people in Jesus.",
    },
    {
      q: "Where can I hear Exodus read aloud?",
      a: "In Lampstand, the daily audio Bible. All 40 chapters of Exodus are read aloud in Walk by day and Sleep by night, with the text on screen and a painting for each scene. Genesis is free to hear, every chapter.",
    },
  ],
  cta: {
    heading: "Hear the tabernacle built, chapter by chapter",
    body: (
      <>
        Lampstand reads the Bible aloud, chapter by chapter: in <strong>Walk</strong>, a clear voice for your day, and in{" "}
        <strong>Sleep</strong>, a slow, quiet reading for the night, with the words on screen and a painting for every scene. All 40
        chapters of Exodus are ready to hear.
      </>
    ),
  },
};
