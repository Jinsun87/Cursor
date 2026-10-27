import { Listen, Verse } from "@/components/study/Scripture";
import type { BibleWord } from "./types";

export const MANNA: BibleWord = {
  slug: "manna",
  word: "Manna",
  say: ["MAN-uh"],
  original: [{ language: "Hebrew", script: "מָן", transliteration: "man" }],
  title: "Manna Meaning in the Bible: “What Is It?” Bread from Heaven",
  description:
    "What was manna in the Bible? Why its name means “What is it?”, what it looked and tasted like, how long Israel ate it, and why Jesus called Himself the true bread from heaven.",
  definition: "The bread from heaven God gave Israel every morning for forty years in the wilderness; its name comes from the Hebrew for “What is it?”.",
  lead: (
    <>
      The food that kept a nation alive for forty years was named after a question. When Israel first saw it on the ground, they
      asked each other, <em>What is it?</em>
    </>
  ),
  hero: {
    src: "/images/sleep/exodus-16/s3.jpg",
    alt: "People in plain robes bending to gather white flakes from the desert ground into baskets, tents and mountains behind at dawn",
    caption: "Exodus 16, as painted for Lampstand's reading: gathering the manna at first light.",
  },
  sections: [
    {
      id: "hear",
      nav: "Hear it",
      heading: "The first morning",
      body: (
        <>
          <p>
            A month after leaving Egypt, the people were hungry and grumbling in the desert. God promised to &ldquo;rain down
            bread from heaven&rdquo; (Exodus 16:4). The next morning:
          </p>
          <Listen book="Exodus" chapter={16} from={13} to={15} />
        </>
      ),
    },
    {
      id: "meaning",
      nav: "What it means",
      heading: "Why it is called manna",
      body: (
        <>
          <p>
            &ldquo;What is it?&rdquo; in Hebrew is <em>man hu</em>. The question became the name: manna. Exodus describes it twice:
          </p>
          <Verse book="Exodus" chapter={16} from={31} />
          <p>Numbers adds how the people cooked it:</p>
          <Verse book="Numbers" chapter={11} from={7} to={9} />
        </>
      ),
    },
    {
      id: "rules",
      nav: "Daily bread",
      heading: "Enough for each day",
      body: (
        <>
          <p>
            Manna came with instructions. Each person gathered what they needed for that day. Anything kept overnight bred worms
            and stank, except on the sixth day, when they gathered twice as much and it kept through the Sabbath, when none fell.
            It was a daily lesson in trust: tomorrow&apos;s bread would come tomorrow.
          </p>
          <p>
            It came every morning for forty years, and stopped the day after Israel first ate the produce of Canaan (Joshua 5:12).
            Moses later explained what it had been for:
          </p>
          <Verse book="Deuteronomy" chapter={8} from={3} />
          <p>
            Jesus quoted that verse when He was tempted in the wilderness, and taught His disciples to pray, &ldquo;Give us this day
            our daily bread.&rdquo;
          </p>
        </>
      ),
    },
    {
      id: "jesus",
      nav: "Bread of life",
      heading: "The true bread from heaven",
      body: (
        <>
          <p>
            After Jesus fed five thousand people, the crowd asked Him for a sign, and pointed to the manna. His answer is one of the
            great &ldquo;I am&rdquo; sayings of John&apos;s Gospel:
          </p>
          <Listen book="John" chapter={6} from={31} to={35} />
          <p>
            The manna kept people alive for a day at a time, and their fathers who ate it still died. Jesus offers bread that gives
            life forever (John 6:49&ndash;51).
          </p>
        </>
      ),
    },
  ],
  faq: [
    {
      q: "What was manna in the Bible?",
      a: "The food God provided for Israel in the wilderness. It appeared every morning with the dew as thin flakes on the ground, and the people gathered it, ground it, and baked or boiled it. It fed them for forty years (Exodus 16:35).",
    },
    {
      q: "What does the word manna mean?",
      a: "It comes from the Hebrew question man hu, 'What is it?', which the Israelites asked when they first saw it (Exodus 16:15).",
    },
    {
      q: "What did manna taste like?",
      a: "Exodus 16:31 says it was white like coriander seed and 'tasted like wafers made with honey.' Numbers 11:8 says that cooked, it 'tasted like pastry baked with fine oil.'",
    },
    {
      q: "How long did Israel eat manna?",
      a: "Forty years, until they reached the border of Canaan (Exodus 16:35). It stopped the day after they ate the produce of the land, at Gilgal (Joshua 5:12).",
    },
    {
      q: "Why did Jesus call Himself the bread of life?",
      a: "In John 6 the crowd pointed to the manna as Moses' great sign. Jesus answered that the true bread from heaven comes from His Father, and said, 'I am the bread of life. Whoever comes to Me will never hunger' (John 6:35).",
    },
    {
      q: "Where can I hear Exodus 16 and John 6 read aloud?",
      a: "In Lampstand, the daily audio Bible. Exodus and the Gospel of John are read aloud in Walk by day and Sleep by night, with the text on screen and a painting for each scene. Genesis is free to hear, every chapter.",
    },
  ],
  cta: {
    heading: "Hear the wilderness story, and the bread of life",
    body: (
      <>
        Lampstand reads the Bible aloud, chapter by chapter: in <strong>Walk</strong>, a clear voice for your day, and in{" "}
        <strong>Sleep</strong>, a slow, quiet reading for the night, with the words on screen and a painting for every scene. Exodus
        and the Gospel of John are ready to hear.
      </>
    ),
  },
};
