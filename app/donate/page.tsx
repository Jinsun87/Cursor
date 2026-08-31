"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import Link from "next/link";

const CAUSES = [
  { id: "caf", name: "Cognitive health fund", note: "Stand-in for a Cure Alzheimer's Fund style gift." },
  { id: "platform", name: "QuizForge operations", note: "Keep packs researched and the gym lights on." },
];

export default function DonatePage() {
  const { user, donate } = useApp();
  const router = useRouter();
  const [cause, setCause] = useState("caf");
  const [amount, setAmount] = useState(25);
  const [done, setDone] = useState(false);

  function give() {
    if (!user) {
      router.push("/register");
      return;
    }
    donate(amount * 100);
    setDone(true);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-4xl">Donate</h1>
      <p className="mt-3 text-parchment/75">
        The source product splits support three ways: Premium, a named medical
        charity, and the company itself. This recreation uses simulated gifts
        only — no money leaves your browser.
      </p>
      {done ? (
        <p className="mt-8 rounded-2xl border border-gold-500/40 p-6">
          Thank you. {user?.username} recorded a simulated ${amount} gift to{" "}
          {CAUSES.find((c) => c.id === cause)?.name}. Bonus coins were added for
          the demo economy.
        </p>
      ) : (
        <>
          <div className="mt-8 grid gap-3">
            {CAUSES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCause(c.id)}
                className={`rounded-2xl border p-4 text-left ${cause === c.id ? "border-gold-400" : "border-pine-700"}`}
              >
                <p className="font-display text-xl">{c.name}</p>
                <p className="text-sm text-parchment/70">{c.note}</p>
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {[10, 25, 50, 100].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setAmount(n)}
                className={`rounded-full px-4 py-2 ${amount === n ? "bg-gold-400 text-pine-950" : "border border-pine-600"}`}
              >
                ${n}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={give}
            className="mt-6 rounded-full bg-gold-400 px-6 py-3 text-pine-950"
          >
            {user ? `Give $${amount} (simulated)` : "Register to record a gift"}
          </button>
        </>
      )}
      <p className="mt-6 text-sm">
        Or <Link href="/premium" className="text-gold-400">go Premium</Link> and train daily.
      </p>
    </div>
  );
}
