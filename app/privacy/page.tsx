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
        Free sittings may show ads. Prefer Google AdSense on this quiz host
        (same publisher id as the approved apex,{" "}
        <code>NEXT_PUBLIC_ADSENSE_CLIENT</code>
        ). Do not load AdSense and Ezoic on the same page. Premium hides the
        in-page slots. The Ezoic dashboard site is the registrable domain
        mediareferee.com (subdomains are not separate Ezoic sites). This quiz
        host still serves{" "}
        <a href="/ads.txt" className="text-gold-400">
          ads.txt
        </a>{" "}
        (301 to the same Ads.txt Manager file as mediareferee.com). If you
        still use Ezoic instead, set <code>NEXT_PUBLIC_EZOIC_ADS=true</code>{" "}
        and leave the AdSense client unset.
      </p>
      <p className="text-parchment/80">
        The site is meant for adults. Do not use it to collect information from
        children under 13.
      </p>
    </div>
  );
}
