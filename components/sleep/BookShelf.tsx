"use client";

import { useState } from "react";
import type { SleepChapter } from "@/lib/sleep/types";
import { useSleepAudio, type ReadingMode } from "@/lib/sleep/sleep-audio";
import { useReadingProgress, type ChapterProgress } from "@/lib/sleep/progress";
import { SHELF, storyGroups, type ShelfBook } from "@/lib/sleep/books";

type TileState = "heard" | "started" | "new" | "unrecorded";

function stateOf(recorded: boolean, p: ChapterProgress | undefined): TileState {
  if (!recorded) return "unrecorded";
  if (p && p.verse > 1) return "started";
  if (p?.done) return "heard";
  return "new";
}

/**
 * The shelf under the Walk and Sleep cards: the list of books, and a book's
 * chapters (a grid grouped by story) once it is opened. Tapping a chapter shows what it is and
 * where the reader stopped, with Play; nothing starts until Play is pressed.
 */
export function BookShelf({
  mode,
  chapters,
  seconds,
  tonightSlug,
}: {
  mode: ReadingMode;
  chapters: SleepChapter[];
  seconds: Record<string, number>;
  tonightSlug: string;
}) {
  const s = useSleepAudio();
  const progress = useReadingProgress();
  const bySlug = new Map(chapters.map((c) => [c.slug, c]));
  // Starts on the list of books; a book's chapters show only once it is opened.
  const [bookSlug, setBookSlug] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const book = SHELF.find((b) => b.slug === bookSlug && !b.comingSoon);

  const minutes = (slug: string) => Math.max(1, Math.round((seconds[slug] ?? 0) / 60));
  const tally = (b: ShelfBook) => {
    const slugs = Array.from({ length: b.chapters }, (_, i) => `${b.slug}-${i + 1}`);
    const ready = slugs.filter((x) => bySlug.has(x));
    return {
      ready: ready.length,
      heard: ready.filter((x) => progress[x]?.done && !(progress[x].verse > 1)).length,
      totalMin: Math.round(ready.reduce((n, x) => n + (seconds[x] ?? 0), 0) / 60),
    };
  };

  if (!book) {
    return (
      <section className="shelf" aria-label="Books">
        <h3 className="shelf-h">The Bible</h3>
        <ul className="shelf-books">
          {SHELF.map((b) => {
            const t = tally(b);
            const locked = b.comingSoon || b.premium;
            return (
              <li key={b.slug}>
                <button
                  type="button"
                  className={`shelf-book${locked ? " is-locked" : ""}`}
                  disabled={b.comingSoon}
                  onClick={() => {
                    setBookSlug(b.slug);
                    setSelected(null);
                  }}
                >
                  <Cover book={b} />
                  <span className="shelf-book-text">
                    <strong>{b.name}</strong>
                    <small>{b.section}</small>
                    <span className="shelf-book-meta">
                      {b.comingSoon ? (
                        <>
                          <Padlock /> Premium · coming soon
                        </>
                      ) : (
                        `${t.ready} of ${b.chapters} chapters ready · ${t.totalMin} min`
                      )}
                    </span>
                  </span>
                  {b.comingSoon ? null : (
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="shelf-chev">
                      <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  const t = tally(book);
  const sel = selected ? bySlug.get(`${book.slug}-${selected}`) : undefined;

  return (
    <section className="shelf" aria-label={book.name}>
      <button type="button" className="shelf-back" onClick={() => setBookSlug(null)}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All books
      </button>

      <header className="shelf-head">
        <Cover book={book} large />
        <div>
          <h3>{book.name}</h3>
          <p>
            {book.testament} · {book.chapters} chapters · {book.section}
          </p>
          <p className="shelf-tally">
            <span>{t.heard} heard</span> · {t.ready} of {book.chapters} ready · {t.totalMin} min
          </p>
        </div>
      </header>
      <div className="shelf-bar" aria-hidden="true">
        <i style={{ width: `${(t.heard / book.chapters) * 100}%` }} />
        <b style={{ width: `${(t.ready / book.chapters) * 100}%` }} />
      </div>

      {storyGroups(book).map((g) => {
        const nums = Array.from({ length: g.to - g.from + 1 }, (_, i) => g.from + i);
        const selInGroup = selected !== null && selected >= g.from && selected <= g.to;
        return (
          <div key={g.title} className="shelf-group">
            <h4>
              {g.title} <span>{g.from === g.to ? g.from : `${g.from}–${g.to}`}</span>
            </h4>
            <ol className="shelf-grid">
              {nums.map((n) => {
                const slug = `${book.slug}-${n}`;
                const c = bySlug.get(slug);
                const p = progress[slug];
                const state = stateOf(Boolean(c), p);
                const fraction = state === "started" && c ? Math.min(1, (p!.verse - 1) / c.verses.length) : 0;
                const label = [
                  `${book.name} ${n}`,
                  c?.title,
                  state === "heard" ? "heard" : state === "started" ? `stopped at verse ${p!.verse}` : state === "unrecorded" ? "not recorded yet" : null,
                  slug === tonightSlug ? "up next" : null,
                ]
                  .filter(Boolean)
                  .join(", ");
                return (
                  <li key={n}>
                    <button
                      type="button"
                      className={`shelf-tile is-${state}${slug === tonightSlug ? " is-tonight" : ""}${selected === n ? " is-selected" : ""}`}
                      aria-label={label}
                      aria-pressed={selected === n}
                      onClick={() => setSelected(selected === n ? null : n)}
                    >
                      {state === "heard" ? (
                        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" className="shelf-tick">
                          <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : null}
                      <span>{n}</span>
                      {state === "started" ? <i className="shelf-arc" style={{ width: `${Math.max(12, fraction * 100)}%` }} /> : null}
                    </button>
                  </li>
                );
              })}
            </ol>

            {selInGroup ? (
              <ChapterStrip
                key={selected}
                bookName={book.name}
                number={selected!}
                chapter={sel}
                progress={sel ? progress[sel.slug] : undefined}
                minutes={sel ? minutes(sel.slug) : 0}
                onPlay={(verse) => sel && s.open(sel, { mode, verse })}
              />
            ) : null}
          </div>
        );
      })}
    </section>
  );
}

/** What a chapter is and where the reader stopped, with Play. */
function ChapterStrip({
  bookName,
  number,
  chapter,
  progress,
  minutes,
  onPlay,
}: {
  bookName: string;
  number: number;
  chapter?: SleepChapter;
  progress?: ChapterProgress;
  minutes: number;
  onPlay: (verse: number) => void;
}) {
  if (!chapter) {
    return (
      <div className="shelf-strip is-empty" role="status">
        <p>
          <strong>
            {bookName} {number}
          </strong>
          Not recorded yet. New chapters arrive in order, a few at a time.
        </p>
      </div>
    );
  }
  const started = progress && progress.verse > 1;
  return (
    <div className="shelf-strip" role="status">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={chapter.verses[0].image} alt="" />
      <div className="shelf-strip-text">
        <strong>
          {chapter.book} {chapter.chapter} · {chapter.title}
        </strong>
        <small>
          {minutes} min · {chapter.verses.length} verses
          {started ? ` · stopped at verse ${progress!.verse}` : progress?.done ? " · heard" : ""}
        </small>
      </div>
      <button type="button" className="shelf-play" onClick={() => onPlay(started ? progress!.verse : 1)}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M8.5 5.2 L19 12 L8.5 18.8 Z" fill="currentColor" />
        </svg>
        {started ? `Verse ${progress!.verse}` : progress?.done ? "Again" : "Play"}
      </button>
    </div>
  );
}

function Cover({ book, large = false }: { book: ShelfBook; large?: boolean }) {
  return (
    <span
      className={`shelf-cover${large ? " is-large" : ""}`}
      style={{ background: `linear-gradient(160deg, ${book.cover[0]}, ${book.cover[1]})` }}
      aria-hidden="true"
    >
      {book.abbr}
      {book.premium ? (
        <span className="shelf-cover-lock">
          <Padlock />
        </span>
      ) : null}
    </span>
  );
}

function Padlock() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" className="shelf-lock">
      <rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
