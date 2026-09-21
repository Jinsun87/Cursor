import { Environment, LogLevel, Paddle, type PaddleOptions } from "@paddle/paddle-node-sdk";

let paddleInstance: Paddle | null = null;

export function getPaddleInstance(): Paddle {
  if (paddleInstance) {
    return paddleInstance;
  }

  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) {
    throw new Error("PADDLE_API_KEY environment variable is not configured.");
  }

  const environment =
    process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
      ? Environment.production
      : Environment.sandbox;

  const options: PaddleOptions = {
    environment,
    logLevel: LogLevel.error,
  };

  paddleInstance = new Paddle(apiKey, options);
  return paddleInstance;
}
