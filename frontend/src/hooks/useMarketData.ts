import { useEffect, useState } from "react";
import { fetchTopCoins, subscribeToTicker } from "../lib/api";
import { CoinData } from "../lib/types";

export function useMarketData() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ws: WebSocket | null = null;

    const loadData = async () => {
      try {
        const initialCoins = await fetchTopCoins();
        setCoins(initialCoins);
        setLoading(false);

        ws = subscribeToTicker((updates) => {
          setCoins((prevCoins) => {
            const updated = [...prevCoins];

            for (const update of updates) {
              if (!update.s.endsWith("USDT")) continue;

              const index = updated.findIndex((c) => c.symbol === update.s);
              if (index !== -1) {
                updated[index] = {
                  ...updated[index],
                  current_price: parseFloat(update.c),
                  price_change_percentage_24h: parseFloat(update.P),
                  total_volume: parseFloat(update.v),
                  market_cap: parseFloat(update.q),
                };
              }
            }
            return updated;
          });
        });
      } catch (error) {
        console.error("Error loading market data:", error);
        setLoading(false);
      }
    };

    loadData();

    return () => {
      if (ws) ws.close();
    };
  }, []);

  return { coins, loading };
}
