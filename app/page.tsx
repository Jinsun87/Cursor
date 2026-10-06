import type { Metadata } from "next";
import { SectionsHome } from "@/components/home2/SectionsHome";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Lampstand — Know the text.",
    description:
      "Walk through Scripture by day, fall asleep to whole chapters read aloud at night, and breathe slowly when you need calm. Independent and not affiliated with any denomination.",
    path: "/",
  }),
  title: { absolute: "Lampstand — Know the text." },
};

export default function HomePage() {
  return <SectionsHome />;
}
