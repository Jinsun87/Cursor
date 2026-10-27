/**
 * The books on the shelf for Walk and Sleep, with the story each run of
 * chapters tells. A book lists all its chapters; which ones can be played
 * comes from the chapter catalogue (lib/sleep/chapters), so chapters not yet
 * recorded show as "not recorded yet" rather than disappearing.
 */
export type StoryGroup = { title: string; from: number; to: number };

export type ShelfBook = {
  slug: string;
  /** As shown on the shelf ("Psalms"). */
  name: string;
  /** The book's name in the Bible text and chapter data when it differs from `name` ("Psalm"). */
  book?: string;
  /** Two letters for the cover tile, as on a Bible's spine. */
  abbr: string;
  testament: "Old Testament" | "New Testament";
  section: string;
  chapters: number;
  /** Cover tile colours: top and bottom of the gradient. */
  cover: [string, string];
  premium?: boolean;
  comingSoon?: boolean;
  stories?: StoryGroup[];
};

export const SHELF: ShelfBook[] = [
  {
    slug: "genesis",
    name: "Genesis",
    abbr: "Gn",
    testament: "Old Testament",
    section: "The Books of Moses",
    chapters: 50,
    cover: ["#b07a3c", "#5c3a17"],
    stories: [
      { title: "Creation", from: 1, to: 2 },
      { title: "The Fall", from: 3, to: 5 },
      { title: "The Flood", from: 6, to: 9 },
      { title: "The Nations", from: 10, to: 11 },
      { title: "Abraham", from: 12, to: 25 },
      { title: "Isaac and Jacob", from: 26, to: 36 },
      { title: "Joseph", from: 37, to: 50 },
    ],
  },
  {
    slug: "exodus",
    name: "Exodus",
    abbr: "Ex",
    testament: "Old Testament",
    section: "The Books of Moses",
    chapters: 40,
    cover: ["#7a3b33", "#3a1a17"],
    premium: true,
    stories: [
      { title: "Moses", from: 1, to: 4 },
      { title: "The Plagues", from: 5, to: 11 },
      { title: "The Exodus", from: 12, to: 15 },
      { title: "In the Wilderness", from: 16, to: 18 },
      { title: "At Sinai", from: 19, to: 24 },
      { title: "The Tabernacle", from: 25, to: 31 },
      { title: "The Golden Calf", from: 32, to: 34 },
      { title: "The Tabernacle Built", from: 35, to: 40 },
    ],
  },
  {
    slug: "ruth",
    name: "Ruth",
    abbr: "Ru",
    testament: "Old Testament",
    section: "History",
    chapters: 4,
    cover: ["#b8913f", "#5e4518"],
    premium: true,
  },
  {
    slug: "psalm",
    name: "Psalms",
    book: "Psalm",
    abbr: "Ps",
    testament: "Old Testament",
    section: "Poetry and Wisdom",
    chapters: 150,
    cover: ["#3f6a5c", "#173029"],
    premium: true,
    stories: [
      { title: "Book One", from: 1, to: 41 },
      { title: "Book Two", from: 42, to: 72 },
      { title: "Book Three", from: 73, to: 89 },
      { title: "Book Four", from: 90, to: 106 },
      { title: "Book Five", from: 107, to: 150 },
    ],
  },
  {
    slug: "jonah",
    name: "Jonah",
    abbr: "Jon",
    testament: "Old Testament",
    section: "The Prophets",
    chapters: 4,
    cover: ["#2f5a78", "#132838"],
    premium: true,
  },
  {
    slug: "john",
    name: "John",
    abbr: "Jn",
    testament: "New Testament",
    section: "The Gospels",
    chapters: 21,
    cover: ["#a8702e", "#4a2c10"],
    premium: true,
    stories: [
      { title: "The Word and the First Signs", from: 1, to: 4 },
      { title: "Bread, Light and Life", from: 5, to: 10 },
      { title: "Lazarus and the Road to Jerusalem", from: 11, to: 12 },
      { title: "The Upper Room", from: 13, to: 17 },
      { title: "The Cross", from: 18, to: 19 },
      { title: "He Is Risen", from: 20, to: 21 },
    ],
  },
  {
    slug: "philippians",
    name: "Philippians",
    abbr: "Php",
    testament: "New Testament",
    section: "The Letters of Paul",
    chapters: 4,
    cover: ["#8a5a7a", "#3d2236"],
    premium: true,
  },
];

/** Shown under the books, locked, until they are made (see the founding ladder on /open). */
export type ComingSoonShelf = Pick<ShelfBook, "slug" | "name" | "abbr" | "section" | "cover" | "premium">;

export const COMING_SOON: ComingSoonShelf[] = [
  {
    slug: "bible-stories",
    name: "Bedtime Bible Stories",
    abbr: "St",
    section: "Gentle retellings, from Noah to the Prodigal Son",
    cover: ["#3f5a7a", "#1b2a3d"],
    premium: true,
  },
];

/** The story a chapter belongs to, or one group for the whole book. */
export function storyGroups(book: ShelfBook): StoryGroup[] {
  return book.stories ?? [{ title: book.name, from: 1, to: book.chapters }];
}
