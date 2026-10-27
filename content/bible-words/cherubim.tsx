import { Listen, Verse } from "@/components/study/Scripture";
import type { BibleWord } from "./types";

export const CHERUBIM: BibleWord = {
  slug: "cherubim",
  word: "Cherubim",
  say: ["CHAIR-uh-bim"],
  original: [{ language: "Hebrew", script: "כְּרוּבִים", transliteration: "keruvim, singular keruv" }],
  title: "Cherubim in the Bible: What They Are and What They Look Like",
  description:
    "What are cherubim in the Bible? The guardians of Eden, the golden cherubim on the ark, Ezekiel's four-faced living creatures, and why they are nothing like Valentine's cherubs.",
  definition: "Mighty heavenly beings who guard God's holiness and surround His throne; cherub is the singular, cherubim the plural.",
  lead: (
    <>
      Forget the chubby babies of Valentine&apos;s cards. The cherubim of the Bible guard the way to the tree of life with a
      flaming sword, and form the throne of God.
    </>
  ),
  hero: {
    src: "/images/sleep/genesis-3/s3.jpg",
    alt: "Two great winged figures of golden light standing guard at the edge of a dark garden, a whirling sword of flame between them, two small figures walking away",
    caption: "Genesis 3, as painted for Lampstand's reading: the cherubim at the east of Eden.",
  },
  sections: [
    {
      id: "hear",
      nav: "Hear it",
      heading: "The first cherubim",
      body: (
        <>
          <p>
            Cherubim first appear at the saddest moment in Genesis. Adam and Eve have been sent out of the garden, and someone must
            guard the way back:
          </p>
          <Listen book="Genesis" chapter={3} from={22} to={24} />
        </>
      ),
    },
    {
      id: "meaning",
      nav: "What they are",
      heading: "What cherubim are",
      body: (
        <>
          <p>
            Cherubim is the Hebrew plural of cherub. They are heavenly beings, but the Bible never calls them angels in the sense of
            messengers: they are not sent with news. Wherever they appear they are close to God, guarding His holiness or bearing up
            His presence.
          </p>
          <p>The psalms describe God as enthroned among them:</p>
          <Verse book="Psalm" chapter={99} from={1} />
          <p>
            The baby-faced cherub of art comes from the Renaissance <em>putto</em>, a figure from classical decoration, and has
            nothing to do with the Bible&apos;s cherubim.
          </p>
        </>
      ),
    },
    {
      id: "ark",
      nav: "On the ark",
      heading: "Cherubim of gold",
      body: (
        <>
          <p>
            God told Moses to put two cherubim of hammered gold on the lid of the{" "}
            <a href="/bible-words/ark-of-the-covenant">ark of the covenant</a>, facing each other with their wings spread over the
            mercy seat. The space between them was where God would speak:
          </p>
          <Listen book="Exodus" chapter={25} from={18} to={22} />
          <p>
            Cherubim were also woven into the tabernacle&apos;s curtains and the veil before the Most Holy Place (Exodus 26:1, 31).
            Solomon&apos;s temple had two more, carved from olive wood and covered in gold, each ten cubits high, about 15 feet (1
            Kings 6:23).
          </p>
        </>
      ),
    },
    {
      id: "ezekiel",
      nav: "In Ezekiel",
      heading: "What cherubim look like",
      body: (
        <>
          <p>
            The fullest description comes from the prophet Ezekiel, who saw them in visions by the River Kebar in Babylon. He first
            calls them living creatures:
          </p>
          <Verse book="Ezekiel" chapter={1} from={5} to={6} />
          <p>Later he realises what they were, and describes their four faces:</p>
          <Verse book="Ezekiel" chapter={10} from={14} />
          <Verse book="Ezekiel" chapter={10} from={20} />
          <p>
            They are full of eyes, move like flashes of lightning, and carry the throne of God above them. Nothing about them is
            small or sweet.
          </p>
        </>
      ),
    },
  ],
  faq: [
    {
      q: "What are cherubim in the Bible?",
      a: "Powerful heavenly beings who are always found close to God: guarding the way to the tree of life (Genesis 3:24), spreading their wings over the ark (Exodus 25), and carrying His throne in Ezekiel's visions. God is described as 'enthroned above the cherubim' (Psalm 99:1).",
    },
    {
      q: "What is the difference between cherub and cherubim?",
      a: "Cherub is singular and cherubim is plural, following the Hebrew. Some older English Bibles write 'cherubims', but cherubim is already plural.",
    },
    {
      q: "What do cherubim look like?",
      a: "Ezekiel describes them as having a human form with four wings and four faces: of a cherub (or ox), a man, a lion and an eagle (Ezekiel 1:5 to 10, 10:14). They are full of eyes and move like lightning. They look nothing like the baby angels of later art.",
    },
    {
      q: "Are cherubim angels?",
      a: "They are heavenly beings, but the Bible keeps them distinct from the angels who carry messages. Cherubim are never sent to speak to people; they guard and surround God's presence.",
    },
    {
      q: "What is the difference between cherubim and seraphim?",
      a: "Seraphim appear only in Isaiah 6, with six wings, calling 'Holy, holy, holy' above God's throne. Cherubim appear throughout the Bible with four wings and four faces in Ezekiel, guarding and bearing up God's presence.",
    },
    {
      q: "Where can I hear Genesis and Exodus read aloud?",
      a: "In Lampstand, the daily audio Bible. Genesis is free to hear, every chapter, in Walk by day and Sleep by night. Exodus and the Psalms are ready too, with the text on screen and a painting for each scene.",
    },
  ],
  cta: {
    heading: "Hear the Bible from the garden onwards",
    body: (
      <>
        Lampstand reads the Bible aloud, chapter by chapter: in <strong>Walk</strong>, a clear voice for your day, and in{" "}
        <strong>Sleep</strong>, a slow, quiet reading for the night, with the words on screen and a painting for every scene. Genesis
        is free, every chapter.
      </>
    ),
  },
};
