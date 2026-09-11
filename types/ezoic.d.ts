declare global {
  interface Window {
    adsbygoogle?: unknown[];
    ezstandalone?: {
      cmd?: Array<() => void>;
      showAds?: (...ids: number[]) => void;
      destroyPlaceholders?: (...ids: number[]) => void;
      setIsSinglePageApplication?: (value: boolean) => void;
    };
  }
}

export {};
