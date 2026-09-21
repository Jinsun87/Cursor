"use client";

import { initializePaddle, type Environments, type Paddle } from "@paddle/paddle-js";

let paddlePromise: Promise<Paddle | undefined> | null = null;
let paddleInstance: Paddle | null = null;

export function isPaddleConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN &&
      process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN.trim().length > 0,
  );
}

export async function getClientPaddle(): Promise<Paddle | null> {
  if (typeof window === "undefined") return null;
  if (paddleInstance?.Initialized) return paddleInstance;

  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  if (!token) return null;

  if (!paddlePromise) {
    const environment = (process.env.NEXT_PUBLIC_PADDLE_ENV as Environments) || "sandbox";

    paddlePromise = initializePaddle({
      token,
      environment,
      checkout: {
        settings: {
          displayMode: "overlay",
          theme: "dark",
          variant: "one-page",
          successUrl: `${window.location.origin}/profile?checkout=success`,
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

export async function openPaddleCheckout(options: CheckoutOptions): Promise<boolean> {
  try {
    const paddle = await getClientPaddle();
    if (!paddle) {
      console.warn("Paddle is not configured with NEXT_PUBLIC_PADDLE_CLIENT_TOKEN.");
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
