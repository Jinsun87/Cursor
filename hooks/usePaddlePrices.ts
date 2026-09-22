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

export function usePaddlePrices(
  paddle: Paddle | undefined | null,
  country?: string,
): { prices: PaddlePrices; loading: boolean; error: Error | null } {
  const [prices, setPrices] = useState<PaddlePrices>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!paddle) return;

    const lineItems = getLineItems();
    if (lineItems.length === 0) {
      setLoading(false);
      return;
    }

    // If country is absent or an internal sentinel like 'OTHERS'/'UNKNOWN',
    // do NOT pass address/countryCode — Paddle auto-detects from IP.
    const isExplicitCountry = country && country !== "OTHERS" && country !== "UNKNOWN" && country.trim().length === 2;

    const params: Partial<PricePreviewParams> = {
      items: lineItems,
      ...(isExplicitCountry ? { address: { countryCode: country as any } } : {}),
    };

    setLoading(true);
    setError(null);

    paddle
      .PricePreview(params as PricePreviewParams)
      .then((response) => {
        setPrices((prev) => ({ ...prev, ...getPriceAmounts(response) }));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load Paddle price preview:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      });
  }, [country, paddle]);

  return { prices, loading, error };
}
