import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-4xl">How to play</h1>
      <p className="text-parchment/80">
        QuizForge copies the operating loop of QuizGriz (grizly.com), not its
        questions or trademarks. The loop is: browse a topic → complete a pack →
        pass a review → collect a certificate, coins, and social proof.
      </p>
      <ol className="list-decimal space-y-4 pl-5 text-parchment/80">
        <li>
          <strong className="text-parchment">Pick a pack.</strong> Most series
          include about five subject quizzes plus a final review that gets a
          little harder.
        </li>
        <li>
          <strong className="text-parchment">Learn in public or as a guest.</strong>{" "}
          You can play without an account. Progress, coins, and certificates
          require registration. Coins buy a 50/50 or skip one mid-course ad. A
          streak of five correct answers skips the next longform ad for free.
        </li>
        <li>
          <strong className="text-parchment">Master the topic.</strong> Finish every
          pack quiz and score at least 70% on the review.
        </li>
        <li>
          <strong className="text-parchment">Earn coins.</strong> Completions and
          correct answers pay out. Spend them on 50/50 and ad skips. Premium
          grants 5,000 coins.
        </li>
        <li>
          <strong className="text-parchment">Support the mission.</strong> Ads on
          secret quizzes, a paid plan, or donations fund the gym and (in the
          original) a cognitive-health charity.
        </li>
      </ol>
      <p>
        <Link href="/series/geography-1" className="text-gold-400">
          Start Geography 1
        </Link>
      </p>
    </div>
  );
}
