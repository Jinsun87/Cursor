import { type Paddle, type PricePreviewParams, type PricePreviewResponse } from "@paddle/paddle-js";
import { useEffect, useState } from "react";
import { PricingTier } from "@/constants/pricing-tier";

export type PaddlePrices = Record<string, string>;

function getLineItems(): PricePreviewParams["items"] {
  return PricingTier.flatMap((tier) =>
    [tier.priceId.month, tier.priceId.year].filter((id): id is string => Boolean(id && id.trim().length > 0))
  ).map((priceId) => ({
    priceId,
    quantity: 1,
  }));
}

function getPriceAmounts(prices: PricePreviewResponse): PaddlePrices {
  return prices.data.details.lineItems.reduce<PaddlePrices>((acc, item) => {
    // Only use formattedTotals directly as mandated — no Intl.NumberFormat or rounding
    acc[item.price.id] = item.formattedTotals.total;
    return acc;
  }, {});
}

/**
 * Localized prices. Paddle.js detects the visitor's country from their IP in
 * the browser, so the pricing page can stay static and CDN-cached.
 */
export function usePaddlePrices(
  paddle: Paddle | undefined | null,
): { prices: PaddlePrices; country: string | null; loading: boolean; error: Error | null } {
  const [prices, setPrices] = useState<PaddlePrices>({});
  const [country, setCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!paddle) return;

    const lineItems = getLineItems();
    if (lineItems.length === 0) {
      setLoading(false);
      return;
    }

    const params: Partial<PricePreviewParams> = { items: lineItems };

    setLoading(true);
    setError(null);

    paddle
      .PricePreview(params as PricePreviewParams)
      .then((response) => {
        setPrices((prev) => ({ ...prev, ...getPriceAmounts(response) }));
        setCountry(response.data.address?.countryCode ?? null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load Paddle price preview:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      });
  }, [paddle]);

  return { prices, country, loading, error };
}
