import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WordPage } from "@/components/study/WordPage";
import { BIBLE_WORDS, getBibleWord } from "@/content/bible-words";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return BIBLE_WORDS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const word = getBibleWord((await params).slug);
  if (!word) return {};
  return pageMetadata({ title: word.title, description: word.description, path: `/bible-words/${word.slug}` });
}

export default async function BibleWordPage({ params }: Props) {
  const word = getBibleWord((await params).slug);
  if (!word) notFound();
  const others = BIBLE_WORDS.filter((w) => w.slug !== word.slug).map(({ slug, word }) => ({ slug, word }));
  return <WordPage word={word} others={others} />;
}
