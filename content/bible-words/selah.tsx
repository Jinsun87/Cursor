import { Listen, Verse } from "@/components/study/Scripture";
import type { BibleWord } from "./types";

export const SELAH: BibleWord = {
  slug: "selah",
  word: "Selah",
  say: ["SEE-lah", "SAY-lah"],
  original: [{ language: "Hebrew", script: "סֶלָה" }],
  title: "Selah Meaning in the Bible: What It Means and How to Say It",
  description:
    "What does selah mean in the Bible? Where the word comes from, how to pronounce it, why it appears 74 times in the Psalms and Habakkuk, and how to read it aloud.",
  definition:
    "A Hebrew word found 74 times in the Psalms and Habakkuk, generally understood as a musical or liturgical direction marking a pause or interlude.",
  lead: (
    <>
      A word that stops you in the middle of a psalm. It turns up 74 times, almost always at the end of a line, and nobody is quite
      sure what it means. Most likely it told the singers to pause, or the music to rise, before going on.
    </>
  ),
  hero: {
    src: "/images/sleep/psalm-46/s1.jpg",
    alt: "A stormy sea breaking against dark mountains at night, beside a calm river flowing past a lamplit city on a hill",
    caption: "Psalm 46, as painted for Lampstand's reading: the roaring sea, and the river that makes glad the city of God.",
  },
  sections: [
    {
      id: "hear",
      nav: "Hear it",
      heading: "Hear it in a psalm",
      body: (
        <>
          <p>
            Psalm 46 has three selahs, one after each part of the song. Here are its opening verses as they are read in Lampstand.
            Listen for the word at the end of verse 3, and the quiet that follows it.
          </p>
          <Listen book="Psalm" chapter={46} from={1} to={3} />
        </>
      ),
    },
    {
      id: "meaning",
      nav: "What it means",
      heading: "What selah means",
      body: (
        <>
          <p>
            Selah is not part of the sentence around it. It sits outside the words, more like a note in the margin of a hymn book,
            and because the music of the temple is lost, so is its exact sense. What we have are good clues.
          </p>
          <ul className="ls-points">
            <li>
              <strong>A pause or interlude.</strong> The Greek translation of the Psalms, made before the time of Jesus, renders it{" "}
              <em>diapsalma</em>, usually understood as a musical interlude: the voices stop and the instruments play on.
            </li>
            <li>
              <strong>Lift up.</strong> The word is often linked to a Hebrew root meaning to lift up or exalt, perhaps a cue to raise
              the voices or the music, or to lift up praise.
            </li>
            <li>
              <strong>Forever.</strong> Some ancient Jewish translators took it to mean &ldquo;always&rdquo; or &ldquo;forever&rdquo;,
              a kind of amen that seals what has been sung.
            </li>
          </ul>
          <p>
            Whichever is right, it falls at the places where a psalm turns or reaches a peak. Selah is where you stop and let the
            words land.
          </p>
        </>
      ),
    },
    {
      id: "where",
      nav: "Where it appears",
      heading: "Where selah appears",
      body: (
        <>
          <p>
            It appears 71 times across 39 psalms, from Psalm 3 to Psalm 143, and three more times in the prayer of Habakkuk, which
            ends &ldquo;For the choirmaster. With stringed instruments&rdquo;, just like a psalm. The first comes in Psalm 3,
            David&apos;s song as he fled from his son Absalom:
          </p>
          <Verse book="Psalm" chapter={3} from={4} />
          <p>Sometimes it closes a whole psalm, like a held final chord:</p>
          <Verse book="Psalm" chapter={24} from={10} />
          <p>And sometimes it sits right after the heaviest line, giving the words room:</p>
          <Verse book="Psalm" chapter={32} from={5} />
          <p>In Habakkuk it even breaks into the middle of a verse:</p>
          <Verse book="Habakkuk" chapter={3} from={3} />
        </>
      ),
    },
    {
      id: "reading",
      nav: "Reading it",
      heading: "Reading it today",
      body: (
        <>
          <p>
            You do not need to know the music to keep the instruction. When you meet a selah, stop for a breath and think about
            what you have just read. Psalm 46 builds to its best-known line, and then the refrain and a final selah:
          </p>
          <Listen book="Psalm" chapter={46} from={10} to={11} />
          <p>
            &ldquo;Be still&rdquo; is close to what selah asks of a reader: stop rushing through the psalm, and let God be God.
          </p>
        </>
      ),
    },
  ],
  faq: [
    {
      q: "What does selah mean?",
      a: "No one knows for certain. It is a Hebrew word that most scholars take to be a musical or liturgical note: a pause, an interlude, or a moment where the singers or instruments lifted up. It probably comes from a root meaning to lift up or exalt. Wherever it falls, it marks a place to stop and take in what has just been said.",
    },
    {
      q: "How do you pronounce selah?",
      a: "In English it is usually said SEE-lah or SAY-lah, with the stress on the first syllable. The Hebrew is closer to seh-LAH. You can hear it read at the end of Psalm 46:3 in the clip on this page.",
    },
    {
      q: "How many times does selah appear in the Bible?",
      a: "74 times: 71 times in 39 of the Psalms, and 3 times in the prayer of Habakkuk in Habakkuk 3. It never appears in the New Testament.",
    },
    {
      q: "Should you say selah when reading the Psalms aloud?",
      a: "Either is fine. Many Bibles print it as part of the verse, so many readers say it; others simply pause. In Lampstand the readers say it, then leave a short silence before going on.",
    },
    {
      q: "Which psalm has the most selahs?",
      a: "Psalm 89, with four (verses 4, 37, 45 and 48). Psalm 3, the first psalm to use the word, has three, and so does Psalm 46.",
    },
    {
      q: "Where can I hear the Psalms read aloud?",
      a: "In Lampstand, the daily audio Bible. All 150 Psalms are read aloud in Walk by day and Sleep by night, with the text on screen and a painting for each scene. Genesis is free to hear, every chapter.",
    },
  ],
  cta: {
    heading: "Hear every psalm, with every selah",
    body: (
      <>
        Lampstand reads the Bible aloud, chapter by chapter: in <strong>Walk</strong>, a clear voice for your day, and in{" "}
        <strong>Sleep</strong>, a slow, quiet reading for the night, with the words on screen and a painting for every scene. All 150
        Psalms are ready, and every selah gets its pause.
      </>
    ),
  },
};
