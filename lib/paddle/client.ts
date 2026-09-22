"use client";

import { initializePaddle, type Environments, type Paddle } from "@paddle/paddle-js";

let paddlePromise: Promise<Paddle | undefined> | null = null;
let paddleInstance: Paddle | null = null;

/**
 * Returns the configured Paddle environment.
 * FAILS LOUDLY if unset or invalid, preventing accidental execution against the wrong account.
 */
export function getPaddleEnvironment(): Environments {
  const env = process.env.NEXT_PUBLIC_PADDLE_ENV;
  if (!env || env.trim().length === 0) {
    throw new Error(
      "FATAL CONFIG ERROR: NEXT_PUBLIC_PADDLE_ENV is not set. " +
        "You must explicitly configure NEXT_PUBLIC_PADDLE_ENV as 'production' or 'sandbox'."
    );
  }
  const cleanEnv = env.trim().toLowerCase();
  if (cleanEnv !== "production" && cleanEnv !== "sandbox") {
    throw new Error(
      `FATAL CONFIG ERROR: Invalid NEXT_PUBLIC_PADDLE_ENV value "${env}". Expected 'production' or 'sandbox'.`
    );
  }
  return cleanEnv as Environments;
}

/**
 * Returns the client-side Paddle token.
 * FAILS LOUDLY if unset when requested.
 */
export function getPaddleClientToken(): string {
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  if (!token || token.trim().length === 0) {
    throw new Error(
      "FATAL CONFIG ERROR: NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set. " +
        "Set a live client-side token (prefixed with 'live_') in your environment."
    );
  }
  return token.trim();
}

export function isPaddleConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN &&
      process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN.trim().length > 0
  );
}

export async function getClientPaddle(): Promise<Paddle | null> {
  if (typeof window === "undefined") return null;
  if (paddleInstance?.Initialized) return paddleInstance;

  const environment = getPaddleEnvironment();
  const token = getPaddleClientToken();

  if (environment === "production" && !token.startsWith("live_")) {
    console.warn(
      "⚠️ WARNING: NEXT_PUBLIC_PADDLE_ENV is 'production' but NEXT_PUBLIC_PADDLE_CLIENT_TOKEN does not start with 'live_'."
    );
  }

  if (!paddlePromise) {
    paddlePromise = initializePaddle({
      token,
      environment,
      checkout: {
        settings: {
          displayMode: "overlay",
          theme: "dark",
          variant: "one-page",
          successUrl: `${window.location.origin}/welcome`,
        },
      },
    }).then((p) => {
      if (p) paddleInstance = p;
      return p;
    });
  }

  const p = await paddlePromise;
  return p ?? null;
}

export interface CheckoutOptions {
  priceId: string;
  quantity?: number;
  customerEmail?: string;
  customData?: Record<string, string>;
  onSuccess?: () => void;
  onError?: (err: unknown) => void;
}

/**
 * Opens Paddle Checkout as a one-page overlay with success redirect to /welcome.
 */
export async function openPaddleCheckout(options: CheckoutOptions): Promise<boolean> {
  try {
    const paddle = await getClientPaddle();
    if (!paddle) {
      console.error("Cannot open checkout: Paddle failed to initialize.");
      return false;
    }

    paddle.Checkout.open({
      items: [{ priceId: options.priceId, quantity: options.quantity ?? 1 }],
      customer: options.customerEmail ? { email: options.customerEmail } : undefined,
      customData: options.customData,
      settings: {
        displayMode: "overlay",
        theme: "dark",
        variant: "one-page",
        successUrl: `${window.location.origin}/welcome`,
        allowLogout: !options.customerEmail,
      },
    });

    return true;
  } catch (error) {
    console.error("Error opening Paddle Checkout:", error);
    options.onError?.(error);
    return false;
  }
}
