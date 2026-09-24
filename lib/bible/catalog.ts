import type { Book, Chapter, ReadingPlan } from "./types";
import { WEEK_1_CHAPTERS, WEEK_1_ARC } from "./chapters/week1-covenant";
import { WEEK_2_CHAPTERS, WEEK_2_ARC } from "./chapters/week2-kingdom";
import { WEEK_3_CHAPTERS, WEEK_3_ARC } from "./chapters/week3-gospels";
import { WEEK_4_CHAPTERS, WEEK_4_ARC } from "./chapters/week4-church";

export const BOOKS: Book[] = [
  {
    slug: "genesis",
    title: "Genesis",
    testament: "OT",
    totalChapters: 50,
    summary: "The book of origins: creation, covenant, the patriarchs, and God's faithfulness across generations.",
    featuredChapterNumbers: [1, 3, 12, 22],
  },
  {
    slug: "exodus",
    title: "Exodus",
    testament: "OT",
    totalChapters: 40,
    summary: "Deliverance from Egyptian bondage, crossing the Red Sea, and the sacred covenant at Mount Sinai.",
    featuredChapterNumbers: [3, 14, 20],
  },
  {
    slug: "1-samuel",
    title: "1 Samuel",
    testament: "OT",
    totalChapters: 31,
    summary: "From judges to kings: Hannah's prayer, Samuel's call, Saul's tragic reign, and David's courageous faith.",
    featuredChapterNumbers: [17],
  },
  {
    slug: "1-kings",
    title: "1 Kings",
    testament: "OT",
    totalChapters: 22,
    summary: "The glory of Solomon's temple, the divided kingdom, and Elijah's confrontation with the prophets of Baal.",
    featuredChapterNumbers: [18],
  },
  {
    slug: "psalms",
    title: "Psalms",
    testament: "OT",
    totalChapters: 150,
    summary: "The inspired hymnbook of Israel: prayers of deliverance, shepherd peace, and dwelling in the secret place.",
    featuredChapterNumbers: [23, 91],
  },
  {
    slug: "proverbs",
    title: "Proverbs",
    testament: "OT",
    totalChapters: 31,
    summary: "Practical wisdom for daily living: trusting the Lord with all your heart, moral integrity, and discerning discernment.",
    featuredChapterNumbers: [3],
  },
  {
    slug: "isaiah",
    title: "Isaiah",
    testament: "OT",
    totalChapters: 66,
    summary: "The prince of Old Testament prophets: heavenly visions of holiness, comfort for the exile, and the Suffering Servant.",
    featuredChapterNumbers: [53],
  },
  {
    slug: "daniel",
    title: "Daniel",
    testament: "OT",
    totalChapters: 12,
    summary: "Steadfast faith in pagan empires: the lions' den, fiery furnace, and cosmic visions of the everlasting kingdom.",
    featuredChapterNumbers: [6],
  },
  {
    slug: "matthew",
    title: "Matthew",
    testament: "NT",
    totalChapters: 28,
    summary: "The Gospel of the Messiah: Jesus as promised King of Israel, the Sermon on the Mount, and the Great Commission.",
    featuredChapterNumbers: [5, 6],
  },
  {
    slug: "luke",
    title: "Luke",
    testament: "NT",
    totalChapters: 24,
    summary: "The compassionate Savior: parables of grace, the prodigal son, the cross, and the walk to Emmaus.",
    featuredChapterNumbers: [15, 24],
  },
  {
    slug: "john",
    title: "John",
    testament: "NT",
    totalChapters: 21,
    summary: "The Word become flesh: signs and wonders, the Upper Room peace, and the resurrection dawn in the garden.",
    featuredChapterNumbers: [1, 14, 20],
  },
  {
    slug: "acts",
    title: "Acts",
    testament: "NT",
    totalChapters: 28,
    summary: "The birth of the global church: rushing wind at Pentecost, bold witness under persecution, and the Damascus road.",
    featuredChapterNumbers: [2, 9],
  },
  {
    slug: "romans",
    title: "Romans",
    testament: "NT",
    totalChapters: 16,
    summary: "The magnificent peak of Gospel doctrine: justification by faith, adoption as sons, and unbreakable love.",
    featuredChapterNumbers: [8],
  },
  {
    slug: "1-corinthians",
    title: "1 Corinthians",
    testament: "NT",
    totalChapters: 16,
    summary: "Order in the church, unity in diversity, the supreme excellence of agape love, and the bodily resurrection.",
    featuredChapterNumbers: [13],
  },
  {
    slug: "ephesians",
    title: "Ephesians",
    testament: "NT",
    totalChapters: 6,
    summary: "Heavenly blessings in Christ, unity in the body, walking as children of light, and standing firm in the full armor of God.",
    featuredChapterNumbers: [6],
  },
  {
    slug: "philippians",
    title: "Philippians",
    testament: "NT",
    totalChapters: 4,
    summary: "The epistle of unshakable joy: Christ's humility, the secret of contentment, and peace surpassing understanding.",
    featuredChapterNumbers: [4],
  },
  {
    slug: "hebrews",
    title: "Hebrews",
    testament: "NT",
    totalChapters: 13,
    summary: "The supremacy of Christ above all: a superior high priest, a better covenant, and the great cloud of witnesses in the Hall of Faith.",
    featuredChapterNumbers: [11],
  },
  {
    slug: "james",
    title: "James",
    testament: "NT",
    totalChapters: 5,
    summary: "Faith with sleeves rolled up: enduring trials with joy, taming the tongue, asking for wisdom, and being doers of the Word.",
    featuredChapterNumbers: [1],
    discussionCount: 310,
  },
  {
    slug: "1-john",
    title: "1 John",
    testament: "NT",
    totalChapters: 5,
    summary: "God is light and God is love: fellowship with the Father, testing the spirits, and assurance of eternal life.",
    featuredChapterNumbers: [1, 4],
    discussionCount: 930,
  },
  {
    slug: "2-john",
    title: "2 John",
    testament: "NT",
    totalChapters: 1,
    summary: "Walking in truth and love: hospitality with discernment and abiding in the teaching of Christ.",
    featuredChapterNumbers: [1],
    discussionCount: 22,
  },
  {
    slug: "3-john",
    title: "3 John",
    testament: "NT",
    totalChapters: 1,
    summary: "Faithful partnership in the truth: commendable hospitality of Gaius and the warning against Diotrephes.",
    featuredChapterNumbers: [1],
    discussionCount: 15,
  },
  {
    slug: "jude",
    title: "Jude",
    testament: "NT",
    totalChapters: 1,
    summary: "Contending earnestly for the faith: guarding against apostasy and the glorious doxology of Him who keeps us from stumbling.",
    featuredChapterNumbers: [1],
    discussionCount: 40,
  },
  {
    slug: "revelation",
    title: "Revelation",
    testament: "NT",
    totalChapters: 22,
    summary: "The Apocalypse of Jesus Christ: the triumph over evil, all tears wiped away, and the celestial New Jerusalem.",
    featuredChapterNumbers: [21],
    discussionCount: 642,
  },
];

// All 30 Landmark Chapters in chronological curriculum order
export const CHAPTERS: Chapter[] = [
  ...WEEK_1_CHAPTERS,
  ...WEEK_2_CHAPTERS,
  ...WEEK_3_CHAPTERS,
  ...WEEK_4_CHAPTERS,
];

export const READING_PLANS: ReadingPlan[] = [
  {
    slug: "anchors-of-scripture",
    title: "Anchors of Scripture",
    subtitle: "30-Day Landmark Journey from Creation to New Jerusalem",
    days: 30,
    badge: "Mastery Anchor Track",
    description:
      "Experience the monumental narrative arc of Scripture through 30 landmark illuminated chapters, with museum-grade art, original Hebrew/Greek WordSparks, and active recall check-ins.",
    arcs: [
      {
        name: WEEK_1_ARC,
        description: "From cosmic creation through the burning bush, the Red Sea, and the covenant at Sinai.",
        startDay: 1,
        endDay: 7,
        badge: "7-Day Trial Milestone",
      },
      {
        name: WEEK_2_ARC,
        description: "Courage in the valley of Elah, shepherd peace, trust in Proverbs, the suffering servant, and the lions' den.",
        startDay: 8,
        endDay: 14,
        badge: "Fortress of Faith",
      },
      {
        name: WEEK_3_ARC,
        description: "The incarnation, kingdom ethics on the mount, the prodigal son, the upper room, and the empty tomb.",
        startDay: 15,
        endDay: 21,
        badge: "Gospel Light",
      },
      {
        name: WEEK_4_ARC,
        description: "Pentecost power, adoption in Romans 8, unconditional agape, the armor of God, and the celestial city.",
        startDay: 22,
        endDay: 30,
        badge: "30-Day Certificate",
      },
    ],
    chapters: CHAPTERS.map((c) => ({
      bookSlug: c.bookSlug,
      chapterNumber: c.chapterNumber,
      day: c.dayNumber || 1,
      title: c.title,
      arcName: c.arcName,
    })),
  },
  {
    slug: "foundations-of-faith",
    title: "Foundations of Faith",
    subtitle: "From Creation to the Living Word",
    days: 5,
    badge: "Lampstand Foundation",
    description: "Experience 5 landmark chapters bridging the Old Testament covenants to the Gospel of John.",
    chapters: [
      { bookSlug: "genesis", chapterNumber: 1, day: 1, title: "The Creation of the Cosmos" },
      { bookSlug: "genesis", chapterNumber: 12, day: 2, title: "The Call of Abram" },
      { bookSlug: "exodus", chapterNumber: 3, day: 3, title: "The Burning Bush" },
      { bookSlug: "psalms", chapterNumber: 23, day: 4, title: "The Lord is My Shepherd" },
      { bookSlug: "john", chapterNumber: 1, day: 5, title: "The Word Made Flesh" },
    ],
  },
  {
    slug: "sermon-and-psalms",
    title: "Wisdom for the Soul",
    subtitle: "Shepherd peace and mountain wisdom",
    days: 2,
    badge: "Heart of Wisdom",
    description: "Quiet your mind with the peace of Psalm 23 and the revolutionary kingdom beatitudes of Matthew 5.",
    chapters: [
      { bookSlug: "psalms", chapterNumber: 23, day: 1, title: "The Lord is My Shepherd" },
      { bookSlug: "matthew", chapterNumber: 5, day: 2, title: "The Beatitudes" },
    ],
  },
];

export function getChapter(bookSlug: string, chapterNumber: number): Chapter | undefined {
  return CHAPTERS.find(
    (c) => c.bookSlug.toLowerCase() === bookSlug.toLowerCase() && c.chapterNumber === chapterNumber,
  );
}

export function getChapterByCourseDay(dayNumber: number): Chapter | undefined {
  return CHAPTERS.find((c) => c.dayNumber === dayNumber);
}

export function getBook(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug.toLowerCase() === slug.toLowerCase());
}

export function getAdjacentChapters(bookSlug: string, chapterNumber: number) {
  const currentIdx = CHAPTERS.findIndex(
    (c) => c.bookSlug.toLowerCase() === bookSlug.toLowerCase() && c.chapterNumber === chapterNumber,
  );
  if (currentIdx === -1) return { prev: undefined, next: undefined };
  return {
    prev: currentIdx > 0 ? CHAPTERS[currentIdx - 1] : undefined,
    next: currentIdx < CHAPTERS.length - 1 ? CHAPTERS[currentIdx + 1] : undefined,
  };
}

export {
  getChapterQuote,
  getChapterContext,
  getChapterDevotional,
  getChapterPrayer,
} from "./devotionals";

