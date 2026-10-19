import { getChapter } from "@/lib/bible/bsb";
import { BSB_NAME } from "@/lib/bible/bsb";
import { bookByName } from "@/lib/plan/books";

/** Verse text for the reading-plan player. Books outside the canon are refused. */
export function GET(request: Request) {
  const url = new URL(request.url);
  const book = url.searchParams.get("book") ?? "";
  const chapter = Number(url.searchParams.get("chapter"));
  const known = bookByName(book);
  if (!known || !Number.isInteger(chapter) || chapter < 1 || chapter > known.verseCounts.length) {
    return Response.json({ error: "Unknown chapter" }, { status: 400 });
  }
  try {
    const verses = getChapter(book, chapter);
    return Response.json({
      book,
      chapter,
      translation: BSB_NAME,
      verses,
    });
  } catch {
    return Response.json({ error: "Chapter text is missing" }, { status: 404 });
  }
}
