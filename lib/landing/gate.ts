/**
 * Who sees the landing page on the home screen: first-time visitors. Anyone who has answered the
 * welcome, is signed in, opened the installed app or followed a link to a section (?tab=…) gets
 * the app instead. Runs in <head> on every full page load (app/layout.tsx), before first paint,
 * so neither view flashes; LandingSync keeps it right after client-side navigation. Without
 * JavaScript (search engines) neither class is set and the landing page shows. /?landing always
 * shows it (for previewing it, or linking to it from ads).
 */
export const LANDING_GATE = `(function(){var d=document.documentElement;try{var u=new URL(location.href),o=JSON.parse(localStorage.getItem("lampstand-onboarding")||"{}"),i=Object.keys(localStorage).some(function(k){return /^sb-.*-auth-token$/.test(k)}),s=(window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone;d.classList.add(!u.searchParams.has("landing")&&(o.done||i||s||u.searchParams.has("tab")||u.searchParams.has("app"))?"ls-app":"ls-landing")}catch(e){d.classList.add("ls-app")}})();`;
