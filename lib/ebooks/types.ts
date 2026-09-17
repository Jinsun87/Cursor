export type EBookFact = {
  id: number;
  title: string;
  fact: string;
  explanation: string;
  biblicalReference: string;
  category: "patriarchs" | "prophets" | "gospels" | "church" | "geography";
};

export type EBookChapter = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  facts: EBookFact[];
};

export type EBook = {
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  publicationDate: string;
  coverImage: string;
  description: string;
  readingTimeMinutes: number;
  chapters: EBookChapter[];
};
