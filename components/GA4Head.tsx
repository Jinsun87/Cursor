"use client";

export function GA4Head() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (!gaId || !/^G-[A-Z0-9]+$/i.test(gaId)) return null;

  const scriptSrc = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  const initScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}', { page_path: window.location.pathname });
  `;

  return (
    <>
      <script async src={scriptSrc} />
      <script dangerouslySetInnerHTML={{ __html: initScript }} />
    </>
  );
}
