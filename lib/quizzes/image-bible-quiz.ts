import type { Question, QuizChapter } from "@/lib/types";

function q(
  prompt: string,
  choices: string[],
  answerIndex: number,
  explanation: string,
  image?: string,
): Question {
  return { prompt, choices, answerIndex, explanation, image };
}

export const IMAGE_BIBLE_CHAPTERS: QuizChapter[] = [
  {
    title: "Act I: Patriarchs & Ancient Marvels",
    subtitle: "Look at the artwork and identify the Old Testament scene",
    startIndex: 0,
  },
  {
    title: "Act II: Kings, Battles & Prophets",
    subtitle: "Identify the miraculous deliverance and prophetic visions",
    startIndex: 5,
  },
  {
    title: "Act III: Gospels & Miracles of Jesus",
    subtitle: "Identify the life, parables, and ministry of Christ",
    startIndex: 10,
  },
];

export const IMAGE_BIBLE_QUESTIONS: Question[] = [
  q(
    "Look at the picture: Which famous biblical event is depicted here?",
    ["Daniel in the Lions' Den", "Joseph in Egypt", "Samson at the Temple", "David before Saul"],
    0,
    "In Daniel chapter 6, King Darius was tricked into passing a decree that forbade prayer to any god or man except himself for thirty days.\n\nDaniel remained faithful to God, praying three times daily by his open window facing Jerusalem. When discovered, he was thrown into a pit of hungry lions.\n\nGod sent His angel to shut the lions' mouths, and Daniel was unharmed, proclaiming God's sovereignty throughout Babylon.",
    "/images/quizzes/daniel-lions-den.png",
  ),
  q(
    "Look at the artwork: What famous mountain summit is shown where the vessel rested?",
    ["Mount Sinai", "Mount Ararat", "Mount Carmel", "Mount of Olives"],
    1,
    "Genesis 8:4 records that after forty days and nights of deluge, the Ark rested upon the mountains of Ararat.\n\nNoah sent out a raven and a dove to test whether the floodwaters had receded from the earth.\n\nWhen the dove returned with an olive leaf, Noah knew land was emerging, culminating in God establishing the rainbow covenant.",
    "/images/quizzes/noah-ark.png",
  ),
  q(
    "Identify the scene: Which prophet was called by God from a bush that burned without being consumed?",
    ["Elijah", "Moses", "Elisha", "Jeremiah"],
    1,
    "Exodus chapter 3 takes place at Mount Horeb (Sinai), where Moses was pasturing the flock of his father-in-law Jethro.\n\nAn angel of the Lord appeared in flames of fire from within a bush that burned but was not consumed.\n\nGod commanded Moses to remove his sandals on holy ground and commissioned him to deliver Israel from Egyptian bondage.",
    "/images/quizzes/daniel-lions-den.png",
  ),
  q(
    "Look at the image: Which miracle occurred when Moses raised his staff over the waters?",
    ["Water Turned into Wine", "Parting of the Red Sea", "Water From the Rock at Horeb", "Stilling the Storm"],
    1,
    "Exodus 14 describes Israel trapped between Pharaoh's advancing army and the waters of the Red Sea.\n\nMoses stretched out his hand over the sea, and God drove back the waters with a strong east wind all night, forming dry ground.\n\nIsrael crossed safely between walls of water before the sea closed back over Pharaoh's chariots.",
    "/images/quizzes/noah-ark.png",
  ),
  q(
    "Look at the artwork: Which young shepherd defeated the Philistine champion in the Valley of Elah?",
    ["Jonathan", "David", "Gideon", "Saul"],
    1,
    "1 Samuel 17 recounts the battle between Israel and the Philistines. Goliath of Gath challenged Israel's army for forty days.\n\nYoung David, armed only with his shepherd's staff, a sling, and five smooth stones from the brook, confronted the giant in the name of the Lord.\n\nA single sling stone struck Goliath in the forehead, securing victory for Israel.",
    "/images/quizzes/daniel-lions-den.png",
  ),
];
