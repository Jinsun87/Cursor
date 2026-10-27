import { Listen, Verse } from "@/components/study/Scripture";
import type { BibleWord } from "./types";

export const AMEN: BibleWord = {
  slug: "amen",
  word: "Amen",
  say: ["AH-men", "AY-men"],
  original: [
    { language: "Hebrew", script: "אָמֵן", transliteration: "amen" },
    { language: "Greek", script: "ἀμήν", transliteration: "amēn" },
  ],
  title: "Amen Meaning in the Bible: So Be It, Truly",
  description:
    "What does amen mean in the Bible? The Hebrew root behind it, how the Psalms use it, why Jesus began sayings with “Truly, truly”, and why He is called the Amen.",
  definition: "A Hebrew word meaning “it is true” or “so be it”, said to agree with a prayer or blessing, and used by Jesus to begin solemn sayings.",
  lead: (
    <>
      The most-said word in Christian prayer is Hebrew, and it means more than &ldquo;the end&rdquo;. Amen says: <em>this is true,
      and I stand on it</em>.
    </>
  ),
  hero: {
    src: "/images/sleep/philippians-4/s5.jpg",
    alt: "A rolled letter sealed with red wax beside an open page, a pen and a small clay oil lamp on a wooden table at night",
    caption: "Philippians 4, as painted for Lampstand's reading: Paul's letter, finished and sealed.",
  },
  sections: [
    {
      id: "meaning",
      nav: "What it means",
      heading: "What amen means",
      body: (
        <>
          <p>
            Amen comes from a Hebrew root that means to be firm, steady, reliable. The same root gives the Hebrew words for
            faithfulness and for believing. To say amen is to say that something is solid enough to lean your weight on: &ldquo;It is
            true&rdquo;, &ldquo;So be it&rdquo;, &ldquo;Yes&rdquo;.
          </p>
          <p>
            In the Old Testament it is the people&apos;s answer. When a blessing, an oath or a prayer is spoken, everyone listening
            says amen and makes it their own. In Deuteronomy 27, as the curses of the covenant are read out, the whole nation answers
            amen twelve times.
          </p>
          <p>Paul ends his letter to the Philippians the same way, giving glory to God:</p>
          <Listen book="Philippians" chapter={4} from={19} to={20} />
        </>
      ),
    },
    {
      id: "psalms",
      nav: "In the Psalms",
      heading: "Amen and amen: the Psalms",
      body: (
        <>
          <p>
            The book of Psalms is divided into five books, and the first four each end with a blessing and a doubled amen, as if the
            whole congregation were answering. Book One closes this way:
          </p>
          <Verse book="Psalm" chapter={41} from={13} />
          <p>
            Books Two and Three end the same way (Psalm 72:19 and 89:52), and Book Four closes with the people told to join in:
          </p>
          <Listen book="Psalm" chapter={106} from={47} to={48} />
        </>
      ),
    },
    {
      id: "jesus",
      nav: "Truly, truly",
      heading: "“Truly, truly”: Jesus' amen",
      body: (
        <>
          <p>
            Jesus did something no one else did with the word. Instead of saying amen after someone else&apos;s words, He put it at
            the start of His own: &ldquo;Amen, I tell you.&rdquo; English Bibles usually translate it as &ldquo;Truly&rdquo;, or in
            older versions &ldquo;Verily&rdquo;. In John&apos;s Gospel He doubles it, 25 times: &ldquo;Truly, truly&rdquo;.
          </p>
          <Listen book="John" chapter={3} from={1} to={3} />
          <p>
            It is a claim to authority. He does not need anyone else to confirm His words; He confirms them Himself.
          </p>
        </>
      ),
    },
    {
      id: "name",
      nav: "The Amen",
      heading: "Jesus, the Amen",
      body: (
        <>
          <p>In Revelation, Jesus takes the word as a name:</p>
          <Verse book="Revelation" chapter={3} from={14} />
          <p>
            Paul makes the same connection. Every promise God has made finds its &ldquo;yes&rdquo; in Christ, and so the church says
            amen through Him:
          </p>
          <Verse book="2 Corinthians" chapter={1} from={20} />
        </>
      ),
    },
  ],
  faq: [
    {
      q: "What does amen mean?",
      a: "It is true, or so be it. It comes from a Hebrew root meaning firm and reliable, the same root as the words for faithfulness and believing. Saying amen agrees with what has been said and makes it your own.",
    },
    {
      q: "How do you pronounce amen?",
      a: "Both AH-men and AY-men are correct. AH-men is closer to the Hebrew and is common in singing; AY-men is common in spoken English.",
    },
    {
      q: "Why do we say amen at the end of a prayer?",
      a: "Because that is how it was used in Scripture: the people answered a prayer, blessing or oath with amen to agree with it. At the end of your own prayer it means, 'This is what I truly ask.' When someone else prays, your amen joins you to their prayer.",
    },
    {
      q: "What does 'Truly, truly, I tell you' mean?",
      a: "It is Jesus saying 'Amen, amen' in Greek. Instead of agreeing with someone else's words, He used amen to begin His own, a sign that His words stand on His own authority. John records it 25 times.",
    },
    {
      q: "Why is Jesus called the Amen?",
      a: "In Revelation 3:14 He calls Himself 'the Amen, the faithful and true Witness.' He is God's final yes: every promise of God is confirmed in Him (2 Corinthians 1:20).",
    },
    {
      q: "Where can I hear the Psalms and Philippians read aloud?",
      a: "In Lampstand, the daily audio Bible. The Psalms, John and Philippians are read aloud in Walk by day and Sleep by night, with the text on screen and a painting for each scene. Genesis is free to hear, every chapter.",
    },
  ],
  cta: {
    heading: "Hear the Bible, day and night",
    body: (
      <>
        Lampstand reads the Bible aloud, chapter by chapter: in <strong>Walk</strong>, a clear voice for your day, and in{" "}
        <strong>Sleep</strong>, a slow, quiet reading for the night, with the words on screen and a painting for every scene. The
        Psalms, the Gospel of John and Philippians are ready to hear.
      </>
    ),
  },
};
