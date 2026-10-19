import type { Metadata } from "next";
import { PlanBuilder } from "@/components/plan/PlanBuilder";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Bible reading plan",
  description:
    "Build a Bible reading plan at your pace. Read each day on the page. Unlock the Walk or Sleep voice when you want the chapter read aloud.",
  path: "/plan",
});

export default function PlanPage() {
  return <PlanBuilder />;
}
