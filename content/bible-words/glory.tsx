import { Listen, Verse } from "@/components/study/Scripture";
import type { BibleWord } from "./types";

export const GLORY: BibleWord = {
  slug: "glory",
  word: "Glory",
  original: [
    { language: "Hebrew", script: "כָּבוֹד", transliteration: "kavod" },
    { language: "Greek", script: "δόξα", transliteration: "doxa" },
  ],
  title: "Glory Meaning in the Bible: The Weight of God's Presence",
  description:
    "What does glory mean in the Bible? The Hebrew word for weight, Moses asking to see God's glory, the cloud filling the tabernacle, and the glory seen in Jesus.",
  definition: "The weight, splendour and visible presence of God; also the honour and praise given to Him.",
  lead: (
    <>
      In Hebrew, glory is heavy. The word means weight: the sheer substance and worth of God, so real that when it filled the
      tabernacle, Moses could not go in.
    </>
  ),
  hero: {
    src: "/images/sleep/exodus-33/s3.jpg",
    alt: "A narrow cleft between towering walls of rock, golden light pouring in from beyond",
    caption: "Exodus 33, as painted for Lampstand's reading: the cleft in the rock where Moses waited.",
  },
  sections: [
    {
      id: "hear",
      nav: "Hear it",
      heading: "“Please show me Your glory”",
      body: (
        <>
          <p>
            After the golden calf, with the people&apos;s future hanging in the balance, Moses asks God for one thing more. God
            answers with a promise and a warning:
          </p>
          <Listen book="Exodus" chapter={33} from={18} to={23} />
        </>
      ),
    },
    {
      id: "meaning",
      nav: "What it means",
      heading: "What glory means",
      body: (
        <>
          <p>
            The Hebrew <em>kavod</em> comes from a word for heavy. A person with kavod carried weight: wealth, honour, importance.
            Applied to God, it means the full weight of who He is, and often the visible sign of His presence: fire on the mountain,
            the cloud over the tabernacle, light that no one could look at.
          </p>
          <p>
            The New Testament uses the Greek <em>doxa</em>, which had meant opinion or reputation. The Bible filled it with the Old
            Testament&apos;s meaning, and it gives English the word doxology, a short hymn of praise.
          </p>
          <p>
            So glory has two sides. It is what God has, His splendour and presence, and it is what we give back to Him: &ldquo;To our
            God and Father be glory forever and ever. Amen&rdquo; (Philippians 4:20).
          </p>
        </>
      ),
    },
    {
      id: "tabernacle",
      nav: "In the tabernacle",
      heading: "The glory fills the tabernacle",
      body: (
        <>
          <p>
            The book of Exodus ends with the moment everything had been building towards. The tabernacle is finished, and God
            moves in:
          </p>
          <Listen book="Exodus" chapter={40} from={33} to={35} />
          <p>The psalmist saw the same glory written across the sky every night:</p>
          <Verse book="Psalm" chapter={19} from={1} />
        </>
      ),
    },
    {
      id: "jesus",
      nav: "In Jesus",
      heading: "“We have seen His glory”",
      body: (
        <>
          <p>
            Moses was allowed to see only God&apos;s back. John claims something far greater: the glory of God has been seen in a
            human face.
          </p>
          <Verse book="John" chapter={1} from={14} />
          <p>
            On the night before the cross, Jesus prayed that He would return to the glory He had shared with the Father before the
            world began:
          </p>
          <Verse book="John" chapter={17} from={4} to={5} />
        </>
      ),
    },
  ],
  faq: [
    {
      q: "What does glory mean in the Bible?",
      a: "The weight and splendour of God's presence. The Hebrew word kavod comes from 'heavy': God's glory is the full weight of who He is, often seen as fire, cloud or light. It also means the honour and praise people give to God.",
    },
    {
      q: "What is the glory of God?",
      a: "God's own splendour, made visible. In the Old Testament it appeared as fire on Sinai and a cloud filling the tabernacle (Exodus 40:34). In the New Testament John says it was seen in Jesus: 'We have seen His glory' (John 1:14).",
    },
    {
      q: "Did Moses see God's glory?",
      a: "Partly. In Exodus 33 God put Moses in a cleft of the rock and covered him with His hand as His glory passed by, so that Moses saw His back but not His face, for 'no one can see Me and live.'",
    },
    {
      q: "What does 'give glory to God' mean?",
      a: "To honour Him for who He is and what He has done, in words, worship and life. It does not add anything to God; it acknowledges the weight that is already His.",
    },
    {
      q: "What does 'the heavens declare the glory of God' mean?",
      a: "It is Psalm 19:1. The size, order and beauty of the sky speak, without words, of the God who made it, a message the psalm says goes out to the whole earth.",
    },
    {
      q: "Where can I hear Exodus and John read aloud?",
      a: "In Lampstand, the daily audio Bible. Exodus, the Psalms and the Gospel of John are read aloud in Walk by day and Sleep by night, with the text on screen and a painting for each scene. Genesis is free to hear, every chapter.",
    },
  ],
  cta: {
    heading: "Hear Exodus, from the burning bush to the glory cloud",
    body: (
      <>
        Lampstand reads the Bible aloud, chapter by chapter: in <strong>Walk</strong>, a clear voice for your day, and in{" "}
        <strong>Sleep</strong>, a slow, quiet reading for the night, with the words on screen and a painting for every scene. All 40
        chapters of Exodus are ready to hear.
      </>
    ),
  },
};
