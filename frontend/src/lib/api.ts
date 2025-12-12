import { CoinData, TrendingCoin } from "./types";

const BINANCE_API_URL = "https://api.binance.com/api/v3/ticker/24hr";
const COINGECKO_TRENDING_URL = "https://api.coingecko.com/api/v3/search/trending";
const BINANCE_WS_URL = "wss://stream.binance.com:9443/ws/!ticker@arr";

export const fetchTopCoins = async (): Promise<CoinData[]> => {
  const response = await fetch(BINANCE_API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch coin data");
  }
  const data = await response.json();

  const usdtCoins = data.filter((coin: CoinData) => coin.symbol.endsWith("USDT"));

  return usdtCoins
    .sort((a: any, b: any) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
    .slice(0, 50)
    .map((coin: any, index: number) => ({
      id: coin.symbol.toLowerCase(),
      name: coin.symbol.replace("USDT", ""),
      symbol: coin.symbol,
      current_price: parseFloat(coin.lastPrice),
      price_change_percentage_24h: parseFloat(coin.priceChangePercent),
      market_cap: parseFloat(coin.quoteVolume),
      total_volume: parseFloat(coin.volume),
      market_cap_rank: index + 1,
      image: `https://cryptoicons.org/api/icon/${coin.symbol
        .replace("USDT", "")
        .toLowerCase()}/200`,
    }));
};

export const fetchTrendingCoins = async (): Promise<TrendingCoin[]> => {
  const response = await fetch(COINGECKO_TRENDING_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch trending coins");
  }
  const data = await response.json();
  return data.coins.slice(0, 10).map((c: any) => c.item);
};

export const subscribeToTicker = (onMessage: (data: any[]) => void) => {
  const ws = new WebSocket(BINANCE_WS_URL);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  return ws;
};
