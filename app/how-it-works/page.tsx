import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-4xl">How to play</h1>
      <p className="text-parchment/80">
        Lampstand uses a paid-click + long sitting loop: browse a topic →
        complete a pack → pass a review → collect a certificate, coins, and
        social proof. Questions are original. This is a quiz product, not a
        church and not a clone of another trivia brand.
      </p>
      <ol className="list-decimal space-y-4 pl-5 text-parchment/80">
        <li>
          <strong className="text-parchment">Open the Book, or pick a pack.</strong>{" "}
          The flagship sitting is 54 Scripture questions. Bible Foundations
          includes about five subject quizzes plus a final review.
        </li>
        <li>
          <strong className="text-parchment">Learn as a guest or with an account.</strong>{" "}
          You can play without signing up. Progress, coins, and certificates
          require registration. Coins buy 50/50 lifelines or unlock study eBooks.
        </li>
        <li>
          <strong className="text-parchment">Master the topic.</strong> Finish every
          pack quiz and score at least 70% on the review.
        </li>
        <li>
          <strong className="text-parchment">Earn coins & rewards.</strong> Completions and
          correct answers pay out coins. Score 70%+ to claim the $29 Bible Foundations eBook free.
        </li>
        <li>
          <strong className="text-parchment">Keep the lamps lit.</strong> Ads on
          the Quiet room, a paid plan, or donations fund research. We do not
          offer pastoral care.
        </li>
      </ol>
      <p>
        <Link href="/series/bible-foundations" className="text-gold-400">
          Start Bible Foundations
        </Link>
      </p>
    </div>
  );
}
