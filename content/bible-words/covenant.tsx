import { Listen, Verse } from "@/components/study/Scripture";
import type { BibleWord } from "./types";

export const COVENANT: BibleWord = {
  slug: "covenant",
  word: "Covenant",
  original: [
    { language: "Hebrew", script: "בְּרִית", transliteration: "berit" },
    { language: "Greek", script: "διαθήκη", transliteration: "diathēkē" },
  ],
  title: "Covenant Meaning in the Bible: God's Binding Promises",
  description:
    "What is a covenant in the Bible? The meaning of the word, the covenants with Noah, Abraham, Moses and David, and the new covenant Jesus made at the Last Supper.",
  definition: "A solemn, binding agreement that creates a lasting relationship, especially the promises by which God binds Himself to His people.",
  lead: (
    <>
      A covenant is more than a contract. It is a promise that binds two parties into a lasting relationship, sealed with a sign.
      The whole Bible is built around the covenants God makes, and keeps.
    </>
  ),
  hero: {
    src: "/images/sleep/genesis-9/s2.jpg",
    alt: "A rainbow arching over dark mountains and a still river valley after rain, a small family watching from a hillside",
    caption: "Genesis 9, as painted for Lampstand's reading: the rainbow, the sign of the covenant.",
  },
  sections: [
    {
      id: "hear",
      nav: "Hear it",
      heading: "The first covenant sign",
      body: (
        <>
          <p>
            After the flood, God makes a covenant with Noah, his family and every living creature, and gives it a sign anyone can
            see. Notice who does the remembering:
          </p>
          <Listen book="Genesis" chapter={9} from={12} to={16} />
        </>
      ),
    },
    {
      id: "meaning",
      nav: "What it means",
      heading: "What a covenant is",
      body: (
        <>
          <p>
            The Hebrew word is <em>berit</em>. In the ancient world a covenant could be a treaty between kings, a marriage, or a
            pact between friends. It bound people together with promises and obligations, was sworn solemnly, and was usually
            marked by a sign or a sacrifice.
          </p>
          <p>
            What makes the Bible&apos;s covenants different is who makes them. God is not obliged to bind Himself to anyone, but He
            does, again and again, and He puts His own faithfulness on the line. The word appears more than 300 times in the Berean
            Standard Bible.
          </p>
        </>
      ),
    },
    {
      id: "covenants",
      nav: "The covenants",
      heading: "The great covenants",
      body: (
        <>
          <ul className="ls-points">
            <li>
              <strong>With Noah</strong> (Genesis 9): never again a flood to destroy the earth. The sign is the rainbow.
            </li>
            <li>
              <strong>With Abraham</strong> (Genesis 15 and 17): a land, countless descendants, and blessing for all nations. In
              Genesis 15, God alone passes between the halves of the sacrifice, as a smoking firepot and a flaming torch, binding
              Himself to the promise.
            </li>
            <li>
              <strong>At Sinai</strong> (Exodus 19 to 24): God makes Israel His people and gives them His law. The covenant is
              sealed with blood.
            </li>
            <li>
              <strong>With David</strong> (2 Samuel 7): a son of David will reign forever.
            </li>
            <li>
              <strong>The new covenant</strong> (Jeremiah 31): God&apos;s law written on hearts, and sins remembered no more.
            </li>
          </ul>
          <Verse book="Genesis" chapter={17} from={7} />
          <p>At Sinai, Moses reads the covenant to the people and seals it:</p>
          <Listen book="Exodus" chapter={24} from={7} to={8} />
        </>
      ),
    },
    {
      id: "new",
      nav: "New covenant",
      heading: "The new covenant",
      body: (
        <>
          <p>
            Through Jeremiah, at one of the darkest moments in Israel&apos;s history, God promised a covenant of a different kind:
          </p>
          <Verse book="Jeremiah" chapter={31} from={31} to={33} />
          <p>
            On the night before He died, Jesus took a cup at supper and used the same words that Moses had used at Sinai, the
            blood of the covenant, but with one word added:
          </p>
          <Verse book="Luke" chapter={22} from={20} />
          <p>
            That is why the two halves of the Christian Bible are called the Old and New Testaments: &ldquo;testament&rdquo; is an
            old word for covenant.
          </p>
        </>
      ),
    },
  ],
  faq: [
    {
      q: "What is the simple meaning of covenant in the Bible?",
      a: "A covenant is a solemn, binding promise that creates a lasting relationship. In the Bible it most often describes the promises God makes to His people and the relationship He commits Himself to.",
    },
    {
      q: "What is the difference between a covenant and a contract?",
      a: "A contract exchanges goods or services and ends when the terms are met. A covenant binds people to each other, like a marriage, and is meant to last. God's covenants also rest on His faithfulness rather than on the other party's performance.",
    },
    {
      q: "How many covenants are in the Bible?",
      a: "The main ones are the covenants with Noah, Abraham, Israel at Sinai, David, and the new covenant promised in Jeremiah 31 and made by Jesus. Some traditions count more, but these five are the backbone of the Bible's story.",
    },
    {
      q: "What was the sign of the covenant with Noah?",
      a: "The rainbow. God said, 'I have set My rainbow in the clouds, and it will be a sign of the covenant between Me and the earth' (Genesis 9:13).",
    },
    {
      q: "What is the new covenant?",
      a: "The covenant promised in Jeremiah 31:31 to 34, in which God writes His law on people's hearts and forgives their sins. At the Last Supper Jesus said, 'This cup is the new covenant in My blood' (Luke 22:20).",
    },
    {
      q: "Where can I hear Genesis and Exodus read aloud?",
      a: "In Lampstand, the daily audio Bible. Genesis is free to hear, every chapter, in Walk by day and Sleep by night. Exodus, the Psalms and the Gospel of John are ready too, with the text on screen and a painting for each scene.",
    },
  ],
  cta: {
    heading: "Hear the covenant story from the beginning",
    body: (
      <>
        Lampstand reads the Bible aloud, chapter by chapter: in <strong>Walk</strong>, a clear voice for your day, and in{" "}
        <strong>Sleep</strong>, a slow, quiet reading for the night, with the words on screen and a painting for every scene. Genesis
        is free, and Exodus is waiting for you.
      </>
    ),
  },
};
