import { Listen, Verse } from "@/components/study/Scripture";
import type { BibleWord } from "./types";

export const MASKIL: BibleWord = {
  slug: "maskil",
  word: "Maskil",
  say: ["MAS-kil"],
  original: [{ language: "Hebrew", script: "מַשְׂכִּיל" }],
  title: "Maskil Meaning in the Psalms: A Psalm of Insight",
  description:
    "What is a maskil? The Hebrew word in the titles of 13 psalms, what it probably means, which psalms are maskils, and the clue hidden in Psalm 32.",
  definition: "A Hebrew term in the titles of 13 psalms, probably meaning a psalm of insight or instruction, or a skilfully made song.",
  lead: (
    <>
      Thirteen psalms are labelled with a word most readers skip past. It comes from the Hebrew for wisdom and insight, and it may
      tell us what kind of song we are about to hear.
    </>
  ),
  hero: {
    src: "/images/sleep/psalm-42/s1.jpg",
    alt: "A stag bending to drink from a clear stream in a dark forest, mountains catching the last light behind",
    caption: "Psalm 42, a maskil, as painted for Lampstand's reading: “As the deer pants for streams of water.”",
  },
  sections: [
    {
      id: "hear",
      nav: "Hear it",
      heading: "Hear a maskil",
      body: (
        <>
          <p>
            Psalm 32 is the first maskil in the book of Psalms. The word is in its title, read in Lampstand as part of the first
            verse, as the Berean Standard Bible prints it:
          </p>
          <Listen book="Psalm" chapter={32} from={1} to={5} />
        </>
      ),
    },
    {
      id: "meaning",
      nav: "What it means",
      heading: "What maskil means",
      body: (
        <>
          <p>
            Maskil comes from the Hebrew verb <em>sakal</em>: to be wise, to have insight, to act skilfully. Nobody knows exactly
            what it meant as a label for a song, but there are three main suggestions:
          </p>
          <ul className="ls-points">
            <li>
              <strong>A psalm of insight.</strong> A song meant to make the singer and listener wise, something to think over.
            </li>
            <li>
              <strong>A psalm of instruction.</strong> A teaching song, passing on lessons from God or from history.
            </li>
            <li>
              <strong>A skilful psalm.</strong> A song of special artistry, perhaps meant for trained musicians.
            </li>
          </ul>
          <p>
            Psalm 32 itself offers a clue. A few verses after its title, God speaks, and the verb He uses for &ldquo;instruct&rdquo;
            comes from the same Hebrew root as maskil:
          </p>
          <Verse book="Psalm" chapter={32} from={8} />
          <p>
            The word appears once more inside a psalm, in Psalm 47:7, where &ldquo;sing to Him a psalm of praise&rdquo; translates
            the same Hebrew word: sing a maskil.
          </p>
        </>
      ),
    },
    {
      id: "which",
      nav: "Which psalms",
      heading: "Which psalms are maskils",
      body: (
        <>
          <p>
            Thirteen psalms carry the title: Psalms 32, 42, 44, 45, 52, 53, 54, 55, 74, 78, 88, 89 and 142. They are a varied group.
            Psalm 32 is about the joy of being forgiven; Psalm 45 is a royal wedding song; Psalm 78 retells Israel&apos;s history so
            the next generation will not repeat its mistakes; Psalm 88 is the darkest lament in the book.
          </p>
          <p>
            Many come from the temple singers, the sons of Korah and Asaph. Psalm 42 is one of the best loved:
          </p>
          <Listen book="Psalm" chapter={42} from={1} to={2} />
          <p>
            What they share may be exactly what the label says: each one is meant to be pondered and to leave you wiser than
            before.
          </p>
        </>
      ),
    },
  ],
  faq: [
    {
      q: "What does maskil mean?",
      a: "It comes from a Hebrew verb meaning to be wise or to have insight. As a psalm title it probably means a psalm of insight or instruction, or a skilfully composed song. The exact sense is uncertain.",
    },
    {
      q: "How do you pronounce maskil?",
      a: "MAS-kil, with the stress on the first syllable. Some older Bibles spell it Maschil.",
    },
    {
      q: "How many maskil psalms are there?",
      a: "Thirteen: Psalms 32, 42, 44, 45, 52, 53, 54, 55, 74, 78, 88, 89 and 142. The word also appears in the body of Psalm 47:7.",
    },
    {
      q: "Is a maskil a type of music?",
      a: "Possibly. Some scholars think it described a musical style or a song needing special skill. Others think it described the content, a song that teaches. The psalms called maskils include laments, thanksgivings, history and a wedding song, so it does not seem to describe the mood.",
    },
    {
      q: "Who wrote the maskil psalms?",
      a: "Their titles name David (Psalms 32, 52 to 55 and 142), the sons of Korah (42, 44, 45 and 88), Asaph (74 and 78), Heman the Ezrahite (88) and Ethan the Ezrahite (89).",
    },
    {
      q: "Where can I hear the Psalms read aloud?",
      a: "In Lampstand, the daily audio Bible. All 150 Psalms are read aloud in Walk by day and Sleep by night, with the text on screen and a painting for each scene. Genesis is free to hear, every chapter.",
    },
  ],
  cta: {
    heading: "Hear every psalm, titles and all",
    body: (
      <>
        Lampstand reads the Bible aloud, chapter by chapter: in <strong>Walk</strong>, a clear voice for your day, and in{" "}
        <strong>Sleep</strong>, a slow, quiet reading for the night, with the words on screen and a painting for every scene. All 150
        Psalms are ready to hear.
      </>
    ),
  },
};
