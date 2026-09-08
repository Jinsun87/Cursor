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
        Free sittings may show ads via Ezoic standalone JavaScript (Gatekeeper
        CMP for consent). Premium hides the placeholders. Production also needs
        Google MCM approval and a real{" "}
        <a href="/ads.txt" className="text-gold-400">
          ads.txt
        </a>{" "}
        for quiz.mediareferee.com — either Ezoic&apos;s file or a 301 to the
        Ads.txt Manager URL from the publisher dashboard. Set{" "}
        <code>NEXT_PUBLIC_EZOIC_ADS=true</code> on the host to load CMP and ad
        scripts in the document head.
      </p>
      <p className="text-parchment/80">
        The site is meant for adults. Do not use it to collect information from
        children under 13.
      </p>
    </div>
  );
}
