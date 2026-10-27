import { Listen, Verse } from "@/components/study/Scripture";
import type { BibleWord } from "./types";

export const ARK_OF_THE_COVENANT: BibleWord = {
  slug: "ark-of-the-covenant",
  word: "Ark of the covenant",
  original: [{ language: "Hebrew", script: "אֲרוֹן הַבְּרִית", transliteration: "aron ha-berit" }],
  title: "Ark of the Covenant in the Bible: What It Was and What Was Inside",
  description:
    "What was the ark of the covenant? Its size and design from Exodus 25, the mercy seat and cherubim, what was kept inside, and what happened to it.",
  definition: "The gold-covered chest that held the stone tablets of the covenant and stood in the Most Holy Place, where God met with His people.",
  lead: (
    <>
      A wooden chest, covered in gold, carried on poles through the wilderness. It was the most sacred object in Israel: the
      place where God said, <em>I will meet with you there</em>.
    </>
  ),
  hero: {
    src: "/images/sleep/exodus-25/s2.jpg",
    alt: "A golden chest with two golden cherubim on its lid, their wings stretched towards each other, glowing in a dark stone chamber",
    caption: "Exodus 25, as painted for Lampstand's reading: the ark, with the mercy seat and the two cherubim.",
  },
  sections: [
    {
      id: "hear",
      nav: "Hear it",
      heading: "How it was made",
      body: (
        <>
          <p>
            The ark is the first thing God describes when He gives Moses the pattern for the tabernacle. Everything else is
            arranged around it.
          </p>
          <Listen book="Exodus" chapter={25} from={10} to={16} />
          <p>
            A cubit was about 18 inches (45 cm), so the ark was roughly 45 by 27 by 27 inches (about 113 by 68 by 68 cm): a chest
            you could stand beside, not a room.
          </p>
        </>
      ),
    },
    {
      id: "mercy-seat",
      nav: "The mercy seat",
      heading: "The mercy seat and the cherubim",
      body: (
        <>
          <p>
            Its lid was a slab of pure gold called the mercy seat, or atonement cover, with two{" "}
            <a href="/bible-words/cherubim">cherubim</a> hammered from the same piece, their wings spread over it. This was the
            meeting place:
          </p>
          <Listen book="Exodus" chapter={25} from={17} to={22} />
          <p>
            Once a year, on the Day of Atonement, the high priest entered the Most Holy Place and sprinkled blood on the mercy seat
            for the sins of the people (Leviticus 16).
          </p>
        </>
      ),
    },
    {
      id: "inside",
      nav: "What was inside",
      heading: "What was inside the ark",
      body: (
        <>
          <p>
            In Exodus it is called the ark of the Testimony, because it held the Testimony: the two stone tablets of the Ten
            Commandments. From Numbers onwards it is usually called the ark of the covenant. The letter to the Hebrews lists three
            things kept in or with it:
          </p>
          <Verse book="Hebrews" chapter={9} from={4} />
          <p>
            The jar of <a href="/bible-words/manna">manna</a> (Exodus 16:33) and Aaron&apos;s staff (Numbers 17:10) were both kept
            &ldquo;before the Testimony&rdquo; as reminders. By Solomon&apos;s day only the tablets remained:
          </p>
          <Verse book="1 Kings" chapter={8} from={9} />
        </>
      ),
    },
    {
      id: "story",
      nav: "Its story",
      heading: "The ark's story",
      body: (
        <>
          <p>
            The ark went ahead of Israel through the wilderness. When the priests carrying it stepped into the flooded Jordan, the
            river stopped:
          </p>
          <Verse book="Joshua" chapter={3} from={17} />
          <p>
            It was captured by the Philistines and sent back (1 Samuel 4 to 6), brought up to Jerusalem by David with dancing (2
            Samuel 6), and placed by Solomon in the Most Holy Place of the temple (1 Kings 8). After the Babylonians destroyed
            Jerusalem in 586 BC, the Bible never mentions it on earth again. Jeremiah had foretold a day when no one would miss it
            (Jeremiah 3:16), and in Revelation John sees it in the temple of God in heaven:
          </p>
          <Verse book="Revelation" chapter={11} from={19} />
        </>
      ),
    },
  ],
  faq: [
    {
      q: "What was the ark of the covenant?",
      a: "A chest of acacia wood overlaid with gold, made at Mount Sinai following Exodus 25. It held the stone tablets of the covenant, was covered by the golden mercy seat with two cherubim, and stood in the Most Holy Place, where God said He would meet with His people.",
    },
    {
      q: "What was inside the ark of the covenant?",
      a: "The two stone tablets of the Ten Commandments. Hebrews 9:4 also mentions the gold jar of manna and Aaron's staff that budded, which had been kept before it. By Solomon's time, 'there was nothing in the ark except the two stone tablets' (1 Kings 8:9).",
    },
    {
      q: "How big was the ark of the covenant?",
      a: "Two and a half cubits long and a cubit and a half wide and high (Exodus 25:10). With a cubit of about 18 inches, that is roughly 45 by 27 by 27 inches, or about 113 by 68 by 68 cm.",
    },
    {
      q: "What is the mercy seat?",
      a: "The solid gold lid of the ark, with a cherub at each end. God said He would meet with Moses 'above the mercy seat, between the two cherubim' (Exodus 25:22). On the Day of Atonement the high priest sprinkled blood on it for the people's sins.",
    },
    {
      q: "What happened to the ark of the covenant?",
      a: "The Bible does not say. It was in Solomon's temple, which the Babylonians destroyed in 586 BC, and it is never mentioned on earth after that. Revelation 11:19 describes the ark of His covenant seen in God's temple in heaven.",
    },
    {
      q: "Where can I hear Exodus 25 read aloud?",
      a: "In Lampstand, the daily audio Bible. All 40 chapters of Exodus are read aloud in Walk by day and Sleep by night, with the text on screen and a painting for each scene. Genesis is free to hear, every chapter.",
    },
  ],
  cta: {
    heading: "Hear Exodus, where the ark was made",
    body: (
      <>
        Lampstand reads the Bible aloud, chapter by chapter: in <strong>Walk</strong>, a clear voice for your day, and in{" "}
        <strong>Sleep</strong>, a slow, quiet reading for the night, with the words on screen and a painting for every scene. All 40
        chapters of Exodus are ready to hear.
      </>
    ),
  },
};
