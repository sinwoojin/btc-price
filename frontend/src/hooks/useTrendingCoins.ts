import { useEffect, useState } from "react";
import { fetchTrendingCoins } from "../lib/api";
import { TrendingCoin } from "../lib/types";

export function useTrendingCoins() {
  const [trending, setTrending] = useState<TrendingCoin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const data = await fetchTrendingCoins();
        setTrending(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading trending coins:", error);
        setLoading(false);
      }
    };

    loadTrending();
  }, []);

  return { trending, loading };
}
