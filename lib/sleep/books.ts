/**
 * The books on the shelf for Walk and Sleep, with the story each run of
 * chapters tells. A book lists all its chapters; which ones can be played
 * comes from the chapter catalogue (lib/sleep/chapters), so chapters not yet
 * recorded show as "not recorded yet" rather than disappearing.
 */
export type StoryGroup = { title: string; from: number; to: number };

export type ShelfBook = {
  slug: string;
  name: string;
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
    comingSoon: true,
  },
];

/** The story a chapter belongs to, or one group for the whole book. */
export function storyGroups(book: ShelfBook): StoryGroup[] {
  return book.stories ?? [{ title: book.name, from: 1, to: book.chapters }];
}
