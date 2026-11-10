import { useId } from "react";

/**
 * Lampstand's mark: an open Bible with a flame rising from its spine (design/logo/mark.svg).
 * The book takes the theme's gold, so it reads on both the dark and the light theme.
 */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  const flame = `ls-flame-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="150 150 724 680" className={className} aria-hidden>
      <defs>
        <linearGradient id={flame} x1="512" y1="468" x2="512" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset=".35" stopColor="#ffc44d" />
          <stop offset="1" stopColor="#e0782a" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="var(--gold)" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round">
        <path d="M512 520 Q360 450 180 490 L180 760 Q360 722 512 790" />
        <path d="M512 520 Q664 450 844 490 L844 760 Q664 722 512 790" />
        <path d="M512 520 L512 790" />
      </g>
      <path d="M512 170 C566 250 600 320 580 390 C566 436 538 462 512 468 C486 462 458 436 444 390 C424 320 458 250 512 170 Z" fill={`url(#${flame})`} />
      <path d="M512 300 C532 340 540 368 532 396 C526 416 518 426 512 428 C506 426 498 416 492 396 C484 368 492 340 512 300 Z" fill="#fffaf0" />
    </svg>
  );
}
