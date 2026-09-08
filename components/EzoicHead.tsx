import { ezoicAdsEnabled } from "@/lib/ezoic";

/** Native head tags so crawlers and CMP see scripts without next/script beforeInteractive. */
export function EzoicHead() {
  if (!ezoicAdsEnabled()) return null;
  return (
    <>
      <script data-cfasync="false" src="https://cmp.gatekeeperconsent.com/min.js" />
      <script data-cfasync="false" src="https://the.gatekeeperconsent.com/cmp.min.js" />
      <script
        dangerouslySetInnerHTML={{
          __html:
            "window.ezstandalone=window.ezstandalone||{};window.ezstandalone.cmd=window.ezstandalone.cmd||[];",
        }}
      />
      <script async src="https://www.ezojs.com/ezoic/sa.min.js" />
      <script async src="https://ezoicanalytics.com/analytics.js" />
    </>
  );
}
