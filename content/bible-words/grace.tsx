import { Listen, Verse } from "@/components/study/Scripture";
import type { BibleWord } from "./types";

export const GRACE: BibleWord = {
  slug: "grace",
  word: "Grace",
  original: [
    { language: "Greek", script: "χάρις", transliteration: "charis" },
    { language: "Hebrew", script: "חֵן", transliteration: "chen" },
  ],
  title: "Grace Meaning in the Bible: God's Undeserved Favour",
  description:
    "What does grace mean in the Bible? The Hebrew and Greek words behind it, grace in the Old Testament, “grace upon grace” in John 1, and grace in Paul's letters.",
  definition: "God's free, undeserved favour and kindness toward people, given as a gift rather than earned.",
  lead: (
    <>
      Grace is kindness you did not earn and cannot repay. In the Bible it is the word for the way God treats people: not as they
      deserve, but as He chooses to, out of love.
    </>
  ),
  hero: {
    src: "/images/sleep/john-1/s3.jpg",
    alt: "A small village of stone houses at night under a starry sky, lamplight in the doorways and a tent pitched among the houses",
    caption: "John 1, as painted for Lampstand's reading: “The Word became flesh and made His dwelling among us.”",
  },
  sections: [
    {
      id: "hear",
      nav: "Hear it",
      heading: "Grace upon grace",
      body: (
        <>
          <p>
            John opens his Gospel with the most concentrated passage on grace in the Bible. In four verses he uses the word four
            times, and all of it is tied to one person:
          </p>
          <Listen book="John" chapter={1} from={14} to={17} />
          <p>
            &ldquo;Grace upon grace&rdquo; pictures one gift arriving on top of another, like waves on a shore, without end.
          </p>
        </>
      ),
    },
    {
      id: "meaning",
      nav: "What it means",
      heading: "What grace means",
      body: (
        <>
          <p>
            The New Testament word is the Greek <em>charis</em>, which meant favour, goodwill, a gift freely given, and the
            gratitude that answers it. In Paul&apos;s hands it becomes the heart of the gospel: God saves people as a gift, not as a
            wage.
          </p>
          <Verse book="Ephesians" chapter={2} from={8} to={9} />
          <p>
            Grace is not only the start of the Christian life but its strength all the way through. When Paul begged to be freed
            from his weakness, he was told:
          </p>
          <Verse book="2 Corinthians" chapter={12} from={9} />
        </>
      ),
    },
    {
      id: "old-testament",
      nav: "Old Testament",
      heading: "Grace in the Old Testament",
      body: (
        <>
          <p>
            The idea did not start with the New Testament. The Hebrew <em>chen</em> means favour, the kindness a superior shows to
            someone who has no claim on it. Its first use in the Bible is about Noah, on the eve of the flood. Older versions read
            &ldquo;Noah found grace&rdquo;; the Berean Standard Bible reads:
          </p>
          <Verse book="Genesis" chapter={6} from={8} />
          <p>
            When God reveals His own name to Moses on Mount Sinai, the first things He says about Himself are that He is
            compassionate and gracious:
          </p>
          <Listen book="Exodus" chapter={34} from={5} to={7} />
        </>
      ),
    },
    {
      id: "greeting",
      nav: "Grace and peace",
      heading: "“Grace and peace to you”",
      body: (
        <>
          <p>
            Paul opens almost every letter with the same greeting, joining the ordinary Greek greeting (<em>chairein</em>, rejoice)
            and the Hebrew <em>shalom</em> into something new:
          </p>
          <Verse book="Philippians" chapter={1} from={2} />
          <p>
            Grace comes first and peace follows from it. The order matters: peace with God is the result of His grace, never the
            price of it.
          </p>
        </>
      ),
    },
  ],
  faq: [
    {
      q: "What is the biblical meaning of grace?",
      a: "God's free and undeserved favour. It is kindness given as a gift, not earned by good behaviour, and the Bible says we are saved by it: 'For it is by grace you have been saved through faith' (Ephesians 2:8).",
    },
    {
      q: "What is the difference between grace and mercy?",
      a: "A common way to put it: mercy is not receiving the punishment you deserve, and grace is receiving the good you do not deserve. In the Bible they often appear together, as in Exodus 34:6, where God calls Himself 'compassionate and gracious.'",
    },
    {
      q: "What does 'grace upon grace' mean?",
      a: "It is from John 1:16: 'From His fullness we have all received grace upon grace.' It means one gift of grace after another, an overflowing, unending supply that comes through Jesus.",
    },
    {
      q: "Where is grace first mentioned in the Bible?",
      a: "In Genesis 6:8, where Noah 'found grace in the eyes of the LORD' (King James Version). The Berean Standard Bible translates the same Hebrew word as 'favor.'",
    },
    {
      q: "Why does Paul say 'grace and peace'?",
      a: "It was his standard greeting, used in Philippians 1:2 and most of his other letters. It combines the Greek idea of grace with the Hebrew greeting shalom, peace, and it puts them in order: peace with God flows from His grace.",
    },
    {
      q: "Where can I hear John and Philippians read aloud?",
      a: "In Lampstand, the daily audio Bible. The Gospel of John, Philippians, Exodus and the Psalms are read aloud in Walk by day and Sleep by night, with the text on screen and a painting for each scene. Genesis is free to hear, every chapter.",
    },
  ],
  cta: {
    heading: "Hear the Bible, day and night",
    body: (
      <>
        Lampstand reads the Bible aloud, chapter by chapter: in <strong>Walk</strong>, a clear voice for your day, and in{" "}
        <strong>Sleep</strong>, a slow, quiet reading for the night, with the words on screen and a painting for every scene. The
        Gospel of John and Philippians are ready to hear.
      </>
    ),
  },
};
