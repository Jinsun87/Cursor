"use client";

export function CheckEmail({ email, onResend, onBack }: { email: string; onResend: () => void; onBack: () => void }) {
  return (
    <div data-testid="check-email" className="mt-8 rounded-2xl border border-gold-500/40 p-6">
      <p className="font-display text-2xl">Check your email</p>
      <p className="mt-2 text-parchment/80">
        We sent a sign-in link to <strong>{email}</strong>. Open it on any device to continue. It may take a minute to
        arrive, and it&apos;s worth checking your spam folder.
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <button type="button" onClick={onResend} className="text-gold-400 underline underline-offset-4">
          Send it again
        </button>
        <button type="button" onClick={onBack} className="text-parchment/70 underline underline-offset-4">
          Use a different email
        </button>
      </div>
    </div>
  );
}

export function GoogleButton({ onClick }: { onClick: () => void }) {
  if (process.env.NEXT_PUBLIC_AUTH_GOOGLE !== "true") return null;
  return (
    <>
      <button type="button" onClick={onClick} className="btn btn-ghost mt-8 w-full">
        Continue with Google
      </button>
      <p className="mt-6 text-center text-xs uppercase tracking-widest text-parchment/50">or use your email</p>
    </>
  );
}

export function AccountsUnavailable() {
  return (
    <p className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
      Accounts are not available right now. Please try again later.
    </p>
  );
}
