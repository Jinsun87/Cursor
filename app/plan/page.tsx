import type { Metadata } from "next";
import { PlanBuilder } from "@/components/plan/PlanBuilder";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Bible reading plan",
  description:
    "Build a Bible reading plan at your pace and read each day free. Genesis can be heard free in Walk and Sleep; other books are read aloud with Premium.",
  path: "/plan",
});

export default function PlanPage() {
  return <PlanBuilder />;
}
