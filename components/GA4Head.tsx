import { GA_MEASUREMENT_ID } from "@/lib/analytics";

export function GA4Head() {
  if (!GA_MEASUREMENT_ID) return null;

  const scriptSrc = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  const initScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', { page_path: window.location.pathname });
  `;

  return (
    <>
      <script async src={scriptSrc} />
      <script dangerouslySetInnerHTML={{ __html: initScript }} />
    </>
  );
}
