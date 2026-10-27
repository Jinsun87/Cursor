import { VerseClip } from "@/components/clip/VerseClip";
import { getChapter } from "@/lib/bible/bsb";
import { buildClip } from "@/lib/clips";
import "./study.css";

type Passage = { book: string; chapter: number; from: number; to?: number };

/** The verses, word for word from the Berean Standard Bible, as the app reads them. */
function quote({ book, chapter, from, to = from }: Passage) {
  const verses = getChapter(book, chapter).filter((v) => v.n >= from && v.n <= to);
  return { ref: `${book} ${chapter}:${from}${to > from ? `–${to}` : ""}`, text: verses.map((v) => v.text).join(" ") };
}

export function Verse(p: Passage) {
  const q = quote(p);
  return (
    <blockquote className="ls-verse">
      <p>{q.text}</p>
      <cite>{q.ref} (BSB)</cite>
    </blockquote>
  );
}

/** The passage as the app reads it, when it has been recorded; the quoted text otherwise. */
export function Listen(p: Passage) {
  const clip = buildClip(p.book, p.chapter, p.from, p.to);
  return clip.walk || clip.sleep ? <VerseClip clip={clip} /> : <Verse {...p} />;
}
