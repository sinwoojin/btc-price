"use client";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Star, TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  market_cap_rank: number;
  image: string;
}

export function CoinTable() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    let ws: WebSocket | null = null;

    const fetchCoins = async () => {
      try {
        const response = await fetch(
          "https://api.binance.com/api/v3/ticker/24hr"
        );
        const data = await response.json();

        const usdtCoins = data.filter((coin: any) =>
          coin.symbol.endsWith("USDT")
        );

        const topCoins = usdtCoins
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

        setCoins(topCoins);
        setLoading(false);

        ws = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");

        ws.onmessage = (event) => {
          const updates = JSON.parse(event.data);

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
        };
      } catch (error) {
        console.error("Error fetching coins:", error);
        setLoading(false);
      }
    };

    fetchCoins();

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const toggleFavorite = (coinId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(coinId)) newFavorites.delete(coinId);
    else newFavorites.add(coinId);
    setFavorites(newFavorites);
  };

  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Top Cryptocurrencies (USDT Market)</span>
          <Badge variant="secondary">Live Data (Binance USDT)</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4">#</th>
                <th className="text-left p-4">코인</th>
                <th className="text-right p-4">가격(USDT)</th>
                <th className="text-right p-4">24h %</th>
                <th className="text-right p-4">Market Cap</th>
                <th className="text-right p-4">Volume (24h)</th>
                <th className="text-center p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {coins.map((coin) => (
                <tr
                  key={coin.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(coin.id)}
                        className="p-1 h-auto"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            favorites.has(coin.id)
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                      <span>{coin.market_cap_rank}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        width={32}
                        height={32}
                        unoptimized
                        src={`https://s3-symbol-logo.tradingview.com/crypto/${coin.name.toLowerCase()}.svg`}
                        alt={coin.name}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          if (!img.src.includes("/placeholder.svg")) {
                            img.src = "/placeholder.svg";
                          }
                        }}
                      />
                      <div>
                        <div className="font-medium">{coin.name}</div>
                        <div className="text-sm text-muted-foreground uppercase">
                          {coin.symbol}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-right font-mono">
                    {formatPrice(coin.current_price)}
                  </td>

                  <td className="p-4 text-right">
                    <div
                      className={`flex items-center justify-end ${
                        coin.price_change_percentage_24h >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {coin.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </div>
                  </td>

                  <td className="p-4 text-right font-mono">
                    {formatMarketCap(coin.market_cap)}
                  </td>

                  <td className="p-4 text-right font-mono">
                    {formatMarketCap(coin.total_volume)}
                  </td>

                  <td className="p-4 text-center">
                    <Button size="sm" variant="outline">
                      <Link href={`/stock/${coin.symbol}`}>Trade</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </CardContent>
    </Card>
  );
}
