import { Listen, Verse } from "@/components/study/Scripture";
import type { BibleWord } from "./types";

export const KINSMAN_REDEEMER: BibleWord = {
  slug: "kinsman-redeemer",
  word: "Kinsman-redeemer",
  original: [{ language: "Hebrew", script: "גֹּאֵל", transliteration: "go'el" }],
  title: "Kinsman-Redeemer Meaning in the Bible: Boaz, Ruth and the Go'el",
  description:
    "What is a kinsman-redeemer? The Hebrew go'el and the law behind it, how Boaz redeemed Ruth and Naomi, and why the Bible calls God Himself our Redeemer.",
  definition: "In Hebrew a go'el: the close relative whose duty was to rescue family members in trouble, buying back their land or freedom.",
  lead: (
    <>
      In ancient Israel, if you fell into poverty, lost your land or sold yourself into slavery, the law named someone to rescue
      you: your nearest relative. The book of Ruth turns on that duty.
    </>
  ),
  hero: {
    src: "/images/sleep/ruth-4/s3.jpg",
    alt: "A lamplit wedding feast in an ancient stone courtyard at night, villagers gathered at long tables beneath an olive tree",
    caption: "Ruth 4, as painted for Lampstand's reading: the wedding of Boaz and Ruth.",
  },
  sections: [
    {
      id: "meaning",
      nav: "What it means",
      heading: "What a kinsman-redeemer was",
      body: (
        <>
          <p>
            The Hebrew word is <em>go&apos;el</em>, &ldquo;one who redeems&rdquo;. In the law of Moses, the go&apos;el was the
            closest male relative, and he had the right, and the duty, to step in when family members could not help themselves:
          </p>
          <ul className="ls-points">
            <li>
              <strong>Buying back land</strong> a relative had been forced to sell, so it stayed in the family (Leviticus 25:25).
            </li>
            <li>
              <strong>Buying back freedom</strong> for a relative who had sold himself into slavery (Leviticus 25:47&ndash;49).
            </li>
            <li>
              <strong>Carrying on the family name</strong> when a man died without a son, through a related duty to marry his widow
              (Deuteronomy 25:5&ndash;10).
            </li>
          </ul>
          <Verse book="Leviticus" chapter={25} from={25} />
        </>
      ),
    },
    {
      id: "ruth",
      nav: "In Ruth",
      heading: "Boaz and Ruth",
      body: (
        <>
          <p>
            Naomi came home to Bethlehem a widow with nothing, bringing her Moabite daughter-in-law Ruth, also a widow. Ruth gleaned
            barley in the fields of a man named Boaz, and when Naomi heard his name, she saw hope:
          </p>
          <Verse book="Ruth" chapter={2} from={20} />
          <p>
            One night at the threshing floor, Ruth asked Boaz to take up that role. He was willing, but there was a closer relative
            with the first right (Ruth 3:12). The next morning, at the town gate, the other man refused, removed his sandal to seal
            it, and Boaz bought the land and married Ruth before the elders. The story ends with a baby:
          </p>
          <Listen book="Ruth" chapter={4} from={13} to={17} />
          <p>
            The kinsman-redeemer the women praise is the child, Obed, who will carry on the family and care for Naomi. He became the
            grandfather of King David, and Matthew lists Boaz and Ruth in the family line of Jesus (Matthew 1:5).
          </p>
        </>
      ),
    },
    {
      id: "god",
      nav: "God our Redeemer",
      heading: "God, the Redeemer",
      body: (
        <>
          <p>
            The Bible uses the same word for God. When He brings Israel out of Egypt, He acts as their go&apos;el: &ldquo;I will
            redeem you with an outstretched arm&rdquo; (Exodus 6:6). Isaiah calls Him Israel&apos;s Redeemer thirteen times.
          </p>
          <Verse book="Isaiah" chapter={44} from={6} />
          <p>And Job, having lost everything, holds on to this:</p>
          <Verse book="Job" chapter={19} from={25} />
          <p>
            Christians have long seen Boaz as a picture of Christ: a near kinsman, able and willing to pay the price, who takes an
            outsider in and gives her a name and a future.
          </p>
        </>
      ),
    },
  ],
  faq: [
    {
      q: "What is a kinsman-redeemer in the Bible?",
      a: "A close relative, in Hebrew a go'el, whose duty under the law of Moses was to rescue family members in trouble: buying back land they had sold, buying them out of slavery, and protecting the family line (Leviticus 25, Deuteronomy 25).",
    },
    {
      q: "Who was the kinsman-redeemer in the book of Ruth?",
      a: "Boaz, a relative of Naomi's late husband Elimelech. A closer relative had the first right but refused, so Boaz bought the family land and married Ruth (Ruth 4:1 to 10).",
    },
    {
      q: "Why did the other relative refuse to redeem?",
      a: "He was willing to buy the land, but not when it meant marrying Ruth too, because the land would pass to her son and not his own heirs: 'I cannot redeem it myself, or I would jeopardize my own inheritance' (Ruth 4:6).",
    },
    {
      q: "Why did the man take off his sandal in Ruth 4?",
      a: "It was how a transfer of property was confirmed at the time: 'a man would remove his sandal and give it to the other party' (Ruth 4:7). By handing it over, he gave his right of redemption to Boaz.",
    },
    {
      q: "How is Jesus our kinsman-redeemer?",
      a: "The Bible calls God the Redeemer of His people, and the New Testament says Jesus redeemed us at the cost of His own life. Like Boaz, He became our near kinsman by sharing our humanity, and He was both able and willing to pay the price.",
    },
    {
      q: "Where can I hear the book of Ruth read aloud?",
      a: "In Lampstand, the daily audio Bible. All four chapters of Ruth are read aloud in Walk by day and Sleep by night, with the text on screen and a painting for each scene. Genesis is free to hear, every chapter.",
    },
  ],
  cta: {
    heading: "Hear the whole story of Ruth",
    body: (
      <>
        Lampstand reads the Bible aloud, chapter by chapter: in <strong>Walk</strong>, a clear voice for your day, and in{" "}
        <strong>Sleep</strong>, a slow, quiet reading for the night, with the words on screen and a painting for every scene. Ruth is
        four short chapters, about 15 minutes in Walk.
      </>
    ),
  },
};
