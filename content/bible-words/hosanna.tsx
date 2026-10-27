import { Listen, Verse } from "@/components/study/Scripture";
import type { BibleWord } from "./types";

export const HOSANNA: BibleWord = {
  slug: "hosanna",
  word: "Hosanna",
  say: ["hoh-ZAN-uh"],
  original: [
    { language: "Greek", script: "ὡσαννά", transliteration: "hōsanna" },
    { language: "Hebrew", script: "הוֹשִׁיעָה נָּא", transliteration: "hoshi'a na" },
  ],
  title: "Hosanna Meaning in the Bible: Save Us, We Pray",
  description:
    "What does hosanna mean? The Hebrew prayer behind the word, the psalm the crowd was singing, and why they shouted it as Jesus rode into Jerusalem.",
  definition: "A Hebrew cry meaning “Save us, we pray”, from Psalm 118, shouted by the crowds as Jesus entered Jerusalem.",
  lead: (
    <>
      Hosanna sounds like pure praise, but it began as a plea for help: <em>save us, please</em>. On the day Jesus rode into
      Jerusalem, a crowd waving palm branches shouted it as both at once.
    </>
  ),
  hero: {
    src: "/images/sleep/john-12/s2.jpg",
    alt: "Jesus riding a young donkey along a dusty road towards the walls of Jerusalem, a crowd waving palm branches on either side",
    caption: "John 12, as painted for Lampstand's reading: the King coming to Jerusalem on a donkey's colt.",
  },
  sections: [
    {
      id: "hear",
      nav: "Hear it",
      heading: "Hear it in John 12",
      body: (
        <>
          <p>
            Five days before the Passover, word spread through the city that Jesus was coming. The crowd went out to meet Him with
            palm branches, and John records what they shouted:
          </p>
          <Listen book="John" chapter={12} from={12} to={15} />
        </>
      ),
    },
    {
      id: "meaning",
      nav: "What it means",
      heading: "What hosanna means",
      body: (
        <>
          <p>
            Hosanna is the Greek spelling of a Hebrew phrase, <em>hoshi&apos;a na</em>: &ldquo;save, please&rdquo; or &ldquo;save us,
            we pray&rdquo;. The first part comes from the same Hebrew root as the names Joshua and Jesus, which mean &ldquo;the LORD
            saves&rdquo;.
          </p>
          <p>
            By the time of Jesus the phrase was sung every year at the great feasts, and it had become a shout of welcome and joy as
            well as a prayer. When the crowd cried &ldquo;Hosanna!&rdquo;, they were praising Him and asking Him to do what His name
            said.
          </p>
        </>
      ),
    },
    {
      id: "psalm",
      nav: "Psalm 118",
      heading: "The psalm they were singing",
      body: (
        <>
          <p>
            The words come from Psalm 118, a song of thanksgiving sung by pilgrims going up to the temple. In the Hebrew, verse 25
            is the hosanna itself, which the Berean Standard Bible translates; the very next line is the blessing the crowd shouted
            at Jesus.
          </p>
          <Listen book="Psalm" chapter={118} from={24} to={26} />
          <p>
            The same psalm says, &ldquo;The stone the builders rejected has become the cornerstone&rdquo; (Psalm 118:22), a verse
            Jesus applied to Himself in the days that followed.
          </p>
        </>
      ),
    },
    {
      id: "where",
      nav: "Where it appears",
      heading: "Where hosanna appears",
      body: (
        <>
          <p>
            The word itself appears six times, all in the Gospels and all about the same day: in Matthew 21:9 and 21:15, Mark
            11:9&ndash;10 and John 12:13. In Matthew the children in the temple courts take it up afterwards, to the indignation of
            the chief priests:
          </p>
          <Verse book="Matthew" chapter={21} from={15} />
          <p>
            Christians have sung it ever since, especially on Palm Sunday, the Sunday before Easter that remembers Jesus&apos; entry
            into Jerusalem.
          </p>
        </>
      ),
    },
  ],
  faq: [
    {
      q: "What does hosanna mean?",
      a: "Save us, we pray. It is the Hebrew phrase hoshi'a na from Psalm 118:25, written in Greek letters. By Jesus' time it was also a shout of praise and welcome, so it carries both meanings: a prayer for salvation and joy at the one who brings it.",
    },
    {
      q: "How do you pronounce hosanna?",
      a: "In English it is usually said hoh-ZAN-uh, with the stress on the middle syllable. You can hear it read in John 12:13 in the clip on this page.",
    },
    {
      q: "Where is hosanna in the Bible?",
      a: "Six times in the Gospels, all on the day Jesus entered Jerusalem: Matthew 21:9 and 21:15, Mark 11:9 and 11:10, and John 12:13. The phrase behind it is Psalm 118:25.",
    },
    {
      q: "What does 'hosanna in the highest' mean?",
      a: "It calls for the praise to reach the highest heaven, or asks God in the highest heaven to save. The phrase is in Matthew 21:9 and Mark 11:10.",
    },
    {
      q: "Why did the crowd wave palm branches?",
      a: "Palm branches were a sign of victory and national celebration, carried at the Feast of Tabernacles and at joyful welcomes. Waving them for Jesus treated Him as a king arriving in triumph, which is why John adds that they cried, 'Blessed is the King of Israel!'",
    },
    {
      q: "Where can I hear John 12 read aloud?",
      a: "In Lampstand, the daily audio Bible. The whole Gospel of John is read aloud in Walk by day and Sleep by night, with the text on screen and a painting for each scene. Genesis is free to hear, every chapter.",
    },
  ],
  cta: {
    heading: "Hear the Gospel of John, start to finish",
    body: (
      <>
        Lampstand reads the Bible aloud, chapter by chapter: in <strong>Walk</strong>, a clear voice for your day, and in{" "}
        <strong>Sleep</strong>, a slow, quiet reading for the night, with the words on screen and a painting for every scene. All 21
        chapters of John are ready, from &ldquo;In the beginning was the Word&rdquo; to the breakfast by the sea.
      </>
    ),
  },
};
