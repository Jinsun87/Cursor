"use client";

export function PrintButton() {
  return (
    <button type="button" className="plan-secondary" onClick={() => window.print()}>
      Print this plan
    </button>
  );
}
