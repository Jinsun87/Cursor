import { ezoicAdsEnabled } from "@/lib/ezoic";

/**
 * Native head tags, no async. Next.js hoists async scripts above CMP,
 * which the Ezoic debugger flags as "cmp.min.js should be placed before sa.min.js".
 */
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
      <script data-cfasync="false" src="https://www.ezojs.com/ezoic/sa.min.js" />
      <script src="https://ezoicanalytics.com/analytics.js" />
    </>
  );
}
