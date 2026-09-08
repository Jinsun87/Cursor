export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="font-display text-4xl">Privacy</h1>
      <p className="text-parchment/80">
        Lampstand on quiz.mediareferee.com is a Scripture quiz desk. It is not a
        church and does not provide pastoral care.
      </p>
      <p className="text-parchment/80">
        Progress, accounts, and theme in this build live in your browser
        (localStorage). There is no server-side user database yet. Demo logins
        are for trying the product, not a production identity system.
      </p>
      <p className="text-parchment/80">
        Free sittings may show ads via Ezoic (consent banner from Gatekeeper
        CMP). Premium hides the placeholders. Set{" "}
        <code>NEXT_PUBLIC_EZOIC_ADS=true</code> on the host to load those
        scripts. Paste Ezoic&apos;s generated{" "}
        <a href="/ads.txt" className="text-gold-400">
          ads.txt
        </a>{" "}
        lines when the publisher dashboard provides them.
      </p>
      <p className="text-parchment/80">
        The site is meant for adults. Do not use it to collect information from
        children under 13.
      </p>
    </div>
  );
}
