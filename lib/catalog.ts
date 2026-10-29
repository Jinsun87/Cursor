import type { Category, Quiz, Series } from "./types";
import {
  BIBLE_FOUNDATIONS_REVIEW,
  EARLY_CHURCH_PATH,
  GOSPELS_MINISTRY,
  PATRIARCHS_AND_EXODUS,
  PROPHETS_AND_WRITINGS,
} from "./quizzes/bible-foundations";
import { OPEN_THE_BOOK_CHAPTERS, OPEN_THE_BOOK_QUESTIONS } from "./quizzes/open-the-book";
import { IMAGE_BIBLE_CHAPTERS, IMAGE_BIBLE_QUESTIONS } from "./quizzes/image-bible-quiz";
import { DAILY_LENGTH } from "./economy";

export const CATEGORIES: Category[] = [
  {
    slug: "bible",
    name: "Bible",
    description: "People, places, and the text — knowledge quizzes, not sermons.",
  },
];

function q(
  prompt: string,
  choices: string[],
  answerIndex: number,
  explanation: string,
) {
  return { prompt, choices, answerIndex, explanation };
}

export const QUIZZES: Quiz[] = [
  {
    slug: "look-at-the-picture-bible",
    title: "Look at the Picture: Can You Name These Famous Bible Events?",
    blurb:
      "Look at the artwork and identify the biblical figure, miraculous event, or holy site. Fast visual recognition quiz designed for high engagement.",
    category: "bible",
    isLongform: true,
    coinsOnComplete: 250,
    chapters: IMAGE_BIBLE_CHAPTERS,
    questions: IMAGE_BIBLE_QUESTIONS,
  },
  {
    slug: "open-the-book",
    title: "Open the Book: Show You Have Solomon's Wisdom on Scripture",
    blurb:
      "Fifty-four original questions on the text — patriarchs, prophets, Gospels, and letters. Score 70% or more to prove your mastery.",
    category: "bible",
    isLongform: true,
    coinsOnComplete: 250,
    chapters: OPEN_THE_BOOK_CHAPTERS,
    questions: OPEN_THE_BOOK_QUESTIONS,
  },
  {
    slug: "scripture-places",
    title: "People and Places in Scripture",
    blurb: "A respectful knowledge quiz, not a sermon.",
    category: "bible",
    seriesSlug: "bible-foundations",
    coinsOnComplete: 70,
    questions: [
      q("The Exodus narrative is set as a departure from:", ["Rome", "Egypt", "Babylon as the only setting", "Nineveh exclusively"], 1, "Moses and the Israelites."),
      q("Bethlehem is associated in the Gospels with:", ["The birth of Jesus", "The building of the Parthenon", "Paul's shipwreck only", "The Council of Nicaea"], 0, "Matthew and Luke."),
      q("The Jordan River is significant as:", ["A setting of crossing and baptism narratives", "The capital of Persia", "A desert in Arabia with no water", "A mountain in Sinai only"], 0, "Geography of the Levant."),
      q("King David is traditionally associated with:", ["Athens", "Jerusalem", "Rome's founding as first emperor", "Mecca as a Biblical king"], 1, "The united monarchy tradition."),
      q("Paul's letters are part of the:", ["New Testament", "Analects of Confucius", "U.S. Constitution", "Epic of Gilgamesh"], 0, "Epistles."),
      q("The Psalms are primarily:", ["Legal tax tables", "Poems and songs", "Roman military manuals", "Ship logs"], 1, "Worship poetry."),
    ],
  },
  {
    slug: "patriarchs-and-exodus",
    title: "Patriarchs and Exodus",
    blurb: "Names and journeys from Genesis through the wilderness — original items, not a sermon.",
    category: "bible",
    seriesSlug: "bible-foundations",
    coinsOnComplete: 80,
    questions: PATRIARCHS_AND_EXODUS,
  },
  {
    slug: "prophets-and-writings",
    title: "Prophets and Writings",
    blurb: "Poets, prophets, and the books that sit beside the law.",
    category: "bible",
    seriesSlug: "bible-foundations",
    coinsOnComplete: 80,
    questions: PROPHETS_AND_WRITINGS,
  },
  {
    slug: "gospels-ministry",
    title: "Gospels: Towns and Signs",
    blurb: "Nazareth, Cana, Galilee, Gethsemane — geography of the narratives.",
    category: "bible",
    seriesSlug: "bible-foundations",
    coinsOnComplete: 80,
    questions: GOSPELS_MINISTRY,
  },
  {
    slug: "early-church-path",
    title: "Acts and the Early Path",
    blurb: "From Jerusalem to Antioch and Athens — people named in Acts.",
    category: "bible",
    seriesSlug: "bible-foundations",
    coinsOnComplete: 80,
    questions: EARLY_CHURCH_PATH,
  },
  {
    slug: "bible-foundations-review",
    title: "Bible Foundations Review",
    blurb: "Score 70% or better after the pack to earn a Certificate of Mastery.",
    category: "bible",
    seriesSlug: "bible-foundations",
    isReview: true,
    coinsOnComplete: 120,
    questions: BIBLE_FOUNDATIONS_REVIEW,
  },
  {
    slug: "secret-odd-knowledge",
    title: "Secret Quiz: Odd Knowledge",
    blurb: "The weirdly useful facts we keep off the homepage.",
    category: "general-knowledge",
    isSecret: true,
    coinsOnComplete: 150,
    questions: [
      q("A baker's dozen is:", ["12", "13", "11", "24"], 1, "Traditional extra roll."),
      q("The QWERTY layout was designed in the era of:", ["Touchscreens", "Typewriters", "Quantum computers", "Carrier pigeons as keyboards"], 1, "To manage jamming, among other debates."),
      q("Zero as a number concept in South Asia is associated with scholars such as:", ["Brahmagupta", "Homer", "Euclid only as the inventor of zero", "Newton as a child"], 0, "Indian mathematics was pivotal."),
      q("The international distress call Mayday comes from:", ["Spanish for help", "French m'aider (help me)", "A pirate code", "Morse for Z"], 1, "Aviation and marine radio."),
      q("UTC is:", ["A U.S. tax code only", "Coordinated Universal Time", "A type of engine oil", "A basketball defense"], 1, "Civil time's backbone."),
      q("A palindrome reads the same:", ["In Morse only", "Forward and backward", "In pig latin only", "Upside down always"], 1, "Like racecar."),
    ],
  },
  {
    slug: "secret-brain-teasers",
    title: "Secret Quiz: Careful Thinking",
    blurb: "Premium-feeling puzzles. Ads for free accounts; quiet for members.",
    category: "general-knowledge",
    isSecret: true,
    coinsOnComplete: 150,
    questions: [
      q("If all bloops are razzes and some razzes are zings, which must be true?", ["Some bloops are zings", "No bloops are razzes", "All bloops are razzes, so bloops are a kind of razz; zings may or may not overlap bloops", "All zings are bloops"], 2, "The overlap with zings is not guaranteed."),
      q("A fair coin flipped twice. Probability of two heads:", ["1/2", "1/3", "1/4", "1"], 2, "HH is one of four equally likely outcomes."),
      q("The next number in 2, 3, 5, 8, 13 is:", ["18", "21", "20", "15"], 1, "Fibonacci-style sums."),
      q("You have a 3- and 5-minute hourglass. To measure 4 minutes you can:", ["Run them in overlapping starts (classic puzzle pattern)", "It is impossible", "Break both", "Use only the 3 twice and ignore the 5"], 0, "Classic water-clock style timing."),
      q("Correlation is not:", ["A statistic people compute", "Causation", "A word", "Used in science"], 1, "Third variables exist."),
      q("Occam's razor suggests preferring:", ["The most supernatural extra parts", "Explanations that do not multiply entities without need", "The longest essay", "Whoever shouts"], 1, "A heuristic, not a proof."),
    ],
  },
];

export const SERIES: Series[] = [
  {
    slug: "bible-foundations",
    title: "Bible Foundations",
    description:
      "Places, patriarchs, prophets, Gospels, and Acts. Finish the pack and pass the review. Independent study — not a church.",
    category: "bible",
    quizSlugs: [
      "scripture-places",
      "patriarchs-and-exodus",
      "prophets-and-writings",
      "gospels-ministry",
      "early-church-path",
    ],
    reviewSlug: "bible-foundations-review",
    masteryThreshold: 70,
  },
];

const DAILY_BANK: { prompt: string; choices: string[]; answerIndex: number; explanation: string }[] = [
  q("The first book of the Christian Old Testament is:", ["Exodus", "Genesis", "Acts", "Romans"], 1, "Genesis opens the canon in Protestant and Catholic orderings of the OT."),
  q("Moses receives the commandments at:", ["Sinai (Horeb)", "Patmos", "Athens", "Rome"], 0, "Exodus and Deuteronomy."),
  q("Ruth stays with:", ["Naomi", "Jezebel", "Herodias", "Lydia as her mother-in-law"], 0, "The book of Ruth."),
  q("David is first introduced as a:", ["Shepherd", "Roman sailor", "Persian satrap", "Levite in Egypt"], 0, "1 Samuel."),
  q("The Psalms are primarily:", ["Songs and poems", "Roman edicts", "Ship logs", "Temple blueprints only"], 0, "Worship poetry."),
  q("Bethlehem in the Gospels is tied to:", ["The birth of Jesus", "Paul's shipwreck", "The tower of Babel", "The fall of Jericho"], 0, "Matthew and Luke."),
  q("Jesus is baptized in the:", ["Jordan", "Nile", "Tiber", "Euphrates"], 0, "The Baptist's ministry."),
  q("The prodigal son parable is in:", ["Luke", "Nahum", "Obadiah", "3 John"], 0, "Luke 15."),
  q("Peter denies Jesus:", ["Three times", "Once in every Gospel identically as a census", "Never in any account", "Twelve times"], 0, "The passion narratives."),
  q("Pentecost in Acts is in:", ["Jerusalem", "Nineveh", "Babylon", "Tarshish"], 0, "Acts 2."),
  q("Saul of Tarsus is also called:", ["Paul", "Solomon", "Ezra", "Silas as his only name"], 0, "Acts."),
  q("The fruit of the Spirit list is in:", ["Galatians", "Jonah", "Ruth", "Jude only"], 0, "Galatians 5."),
  q("Revelation addresses churches in:", ["Asia Minor", "Gaul only", "Britain", "Ethiopia as the seven"], 0, "Ephesus, Smyrna, and the rest."),
  q("Joshua leads Israel across the:", ["Jordan", "Amazon", "Rhine", "Mississippi"], 0, "Joshua 3."),
  q("Nehemiah rebuilds:", ["Jerusalem's walls", "Noah's ark", "The Colosseum", "Caesar's palace"], 0, "The memoir of Nehemiah."),
  q("'In the beginning was the Word' opens:", ["John", "Leviticus", "Amos", "Philemon"], 0, "John 1."),
  q("The Shema ('Hear, O Israel') is in:", ["Deuteronomy", "Acts 27", "Revelation 12 as its only home", "Esther"], 0, "Deuteronomy 6."),
  q("Lydia is baptized in:", ["Philippi", "Ur", "Sodom", "Hebron as a dealer in purple"], 0, "Acts 16."),
  q("The shortest verse in many English Bibles is:", ["Jesus wept", "Selah", "Amen as John 11", "In the beginning"], 0, "John 11:35 in common numbering."),
];

export function getDailyQuiz(now = new Date()): Quiz {
  const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 0));
  const utc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const day = Math.floor((utc - start.getTime()) / 86400000);
  const questions = Array.from({ length: DAILY_LENGTH }, (_, offset) => {
    return DAILY_BANK[(day * 3 + offset) % DAILY_BANK.length];
  });
  const dateLabel = now.toISOString().slice(0, 10);
  return {
    slug: `daily-${dateLabel}`,
    title: `Quiz of the Day — ${dateLabel}`,
    blurb: "Ten Scripture questions every UTC day. Know the text — not a feed.",
    category: "bible",
    isDaily: true,
    coinsOnComplete: 90,
    questions,
  };
}

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getQuiz(slug: string) {
  if (slug.startsWith("daily-")) return getDailyQuiz();
  return QUIZZES.find((q) => q.slug === slug);
}

export function getSeries(slug: string) {
  return SERIES.find((s) => s.slug === slug);
}

export function quizzesInCategory(slug: string) {
  return QUIZZES.filter((q) => q.category === slug && !q.isSecret);
}

export function seriesInCategory(slug: string) {
  return SERIES.filter((s) => s.category === slug);
}

export function getSeriesForQuiz(quiz: Quiz) {
  if (!quiz.seriesSlug) return undefined;
  return getSeries(quiz.seriesSlug);
}

export const SECRET_QUIZZES = QUIZZES.filter((q) => q.isSecret);

// Publicly visible Scripture quizzes (Excludes non-Bible topics from public UI)
export const BIBLE_QUIZZES = QUIZZES.filter((q) => q.category === "bible");
export const VISIBLE_QUIZZES = QUIZZES.filter((q) => q.category === "bible" && !q.isSecret);
export const VISIBLE_CATEGORIES = CATEGORIES.filter((c) => c.slug === "bible");

export const FEATURED_EXPERTS = [
  { category: "bible", name: "Scripture readers", line: "The text, not a sermon." },
];

