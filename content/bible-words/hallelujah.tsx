import { Listen, Verse } from "@/components/study/Scripture";
import type { BibleWord } from "./types";

export const HALLELUJAH: BibleWord = {
  slug: "hallelujah",
  word: "Hallelujah",
  say: ["hal-uh-LOO-yuh"],
  original: [{ language: "Hebrew", script: "הַלְלוּ־יָהּ", transliteration: "hallelu Yah" }],
  title: "Hallelujah Meaning in the Bible: Praise the LORD",
  description:
    "What does hallelujah mean? The Hebrew behind the word, where it appears in the Psalms and Revelation, and why it opens and closes the last psalms of the Bible.",
  definition: "A Hebrew call to worship meaning “Praise the LORD”, literally “praise Yah”, found in the Psalms and in Revelation 19.",
  lead: (
    <>
      Hallelujah is not a feeling but a command, spoken to a whole crowd: <em>all of you, praise the LORD</em>. It is one of the few
      Hebrew words that has passed into almost every language unchanged.
    </>
  ),
  hero: {
    src: "/images/sleep/psalm-150/s1.jpg",
    alt: "A harp, lyres, a ram's horn, trumpets, cymbals and drums resting on the stones of an ancient courtyard at dusk",
    caption: "Psalm 150, as painted for Lampstand's reading: every instrument called to praise.",
  },
  sections: [
    {
      id: "hear",
      nav: "Hear it",
      heading: "Hear it in a psalm",
      body: (
        <>
          <p>
            The last psalm in the Bible is six verses long, and it begins and ends with the same word. Every instrument in the
            temple is called on, and then everything that breathes.
          </p>
          <Listen book="Psalm" chapter={150} from={1} to={6} />
        </>
      ),
    },
    {
      id: "meaning",
      nav: "What it means",
      heading: "What hallelujah means",
      body: (
        <>
          <p>
            It is two Hebrew words joined together. <em>Hallelu</em> means &ldquo;praise&rdquo;, spoken to more than one person:
            &ldquo;all of you, praise&rdquo;. <em>Yah</em> is a short form of God&apos;s own name, the name most English Bibles print
            as &ldquo;the LORD&rdquo; in capital letters. So hallelujah is &ldquo;Praise the LORD!&rdquo;, an invitation for everyone
            within earshot to join in.
          </p>
          <p>
            That is why many English Bibles translate it rather than keep it, and print &ldquo;Praise the LORD&rdquo;. The Berean
            Standard Bible, which Lampstand reads, keeps the Hebrew word itself.
          </p>
        </>
      ),
    },
    {
      id: "where",
      nav: "Where it appears",
      heading: "Where hallelujah appears",
      body: (
        <>
          <p>
            In the Berean Standard Bible it appears 28 times: 24 in the Psalms, all between Psalm 104 and Psalm 150, and four in
            Revelation 19. The first comes at the end of a long psalm about creation:
          </p>
          <Verse book="Psalm" chapter={104} from={35} />
          <p>
            Several of the final psalms are framed by it, opening and closing with hallelujah, so that the book of Psalms ends in a
            rising wave of praise. Psalm 146 begins:
          </p>
          <Verse book="Psalm" chapter={146} from={1} to={2} />
          <p>
            The New Testament uses it only once, in one scene: the great multitude in heaven in Revelation 19, where the word rings
            out four times.
          </p>
          <Verse book="Revelation" chapter={19} from={6} />
        </>
      ),
    },
    {
      id: "today",
      nav: "Saying it",
      heading: "Saying hallelujah today",
      body: (
        <>
          <p>
            Because it is a call rather than a description, hallelujah belongs out loud and in company. The psalms that use it are
            full of reasons: God made the heavens, keeps faith forever, lifts up the humble, feeds the hungry, and sets prisoners
            free. Praise in the Psalms is never empty; it always says what God has done.
          </p>
          <p>
            Psalm 106 shows the pattern. It closes Book Four of the Psalms with a blessing, an amen from all the people, and a
            hallelujah:
          </p>
          <Listen book="Psalm" chapter={106} from={47} to={48} />
        </>
      ),
    },
  ],
  faq: [
    {
      q: "What does hallelujah mean?",
      a: "Praise the LORD. It joins the Hebrew hallelu, an instruction to a group to praise, with Yah, a short form of God's name. It is an invitation for everyone to praise God together.",
    },
    {
      q: "How do you pronounce hallelujah?",
      a: "In English it is usually said hal-uh-LOO-yuh. The Hebrew is closer to ha-le-LOO-yah. You can hear it read at the start and end of Psalm 150 in the clip on this page.",
    },
    {
      q: "Is it hallelujah or alleluia?",
      a: "Both. Alleluia is the same word as it passed through Greek and Latin, which have no 'h' sound at the start. Hallelujah follows the Hebrew more closely.",
    },
    {
      q: "How many times is hallelujah in the Bible?",
      a: "In the Berean Standard Bible, 28 times: 24 in Psalms 104 to 150 and four in Revelation 19. Bibles that translate it as 'Praise the LORD' show fewer, but the Hebrew is the same.",
    },
    {
      q: "Where is hallelujah in the New Testament?",
      a: "Only in Revelation 19, verses 1, 3, 4 and 6, where a great multitude in heaven praises God and the elders answer 'Amen, Hallelujah!'",
    },
    {
      q: "Where can I hear the Psalms read aloud?",
      a: "In Lampstand, the daily audio Bible. All 150 Psalms are read aloud in Walk by day and Sleep by night, with the text on screen and a painting for each scene. Genesis is free to hear, every chapter.",
    },
  ],
  cta: {
    heading: "Hear the Psalms, from the first verse to the last hallelujah",
    body: (
      <>
        Lampstand reads the Bible aloud, chapter by chapter: in <strong>Walk</strong>, a clear voice for your day, and in{" "}
        <strong>Sleep</strong>, a slow, quiet reading for the night, with the words on screen and a painting for every scene. All 150
        Psalms are ready to hear.
      </>
    ),
  },
};
