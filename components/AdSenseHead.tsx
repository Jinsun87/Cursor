import { adsenseClient, adsenseEnabled } from "@/lib/adsense";

export function AdSenseHead() {
  if (!adsenseEnabled()) return null;
  const client = adsenseClient();
  return (
    <>
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
        crossOrigin="anonymous"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `(window.adsbygoogle=window.adsbygoogle||[]).push({google_ad_client:"${client}",enable_page_level_ads:true});`,
        }}
      />
    </>
  );
}
