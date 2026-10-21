import type { Metadata } from "next";
import { Suspense } from "react";
import { PlanReader } from "@/components/plan/PlanReader";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Today's reading",
  description: "Read today's chapter. Genesis is free to hear in Walk and Sleep; other books are read aloud with Premium.",
  path: "/plan/read",
  noindex: true,
});

export default function PlanReadPage() {
  return (
    <Suspense>
      <PlanReader />
    </Suspense>
  );
}
