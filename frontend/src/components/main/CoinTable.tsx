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
        // Binance의 24시간 시세 데이터
        const response = await fetch(
          "https://api.binance.com/api/v3/ticker/24hr"
        );
        const data = await response.json();

        // 상위 50개만 표시
        const topCoins = data.slice(0, 50).map((coin: any, index: number) => ({
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
            .toLowerCase()}/200`, // 코인 아이콘
        }));

        setCoins(topCoins);
        setLoading(false);

        // WebSocket 연결 (모든 심볼 실시간 업데이트)
        ws = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");

        ws.onmessage = (event) => {
          const updates = JSON.parse(event.data);

          setCoins((prevCoins) => {
            const updated = [...prevCoins];
            for (const update of updates) {
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
          <span>Top Cryptocurrencies by Market Cap</span>
          <Badge variant="secondary">Live Data (Binance)</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium text-muted-foreground">
                  #
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  코인 이름(Name)
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground">
                  가격(Price)
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground">
                  24h %
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground">
                  Market Cap
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground">
                  Volume (24h)
                </th>
                <th className="text-center p-4 font-medium text-muted-foreground">
                  Action
                </th>
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
                      <span className="font-medium">
                        {coin.market_cap_rank}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        width={32}
                        height={32}
                        unoptimized     // 추가!!
                        src={`https://s3-symbol-logo.tradingview.com/crypto/${coin.name.toLowerCase()}.svg`}
                        alt={coin.name}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;

                          if (!img.src.includes("/placeholder.svg")) {
                            img.src = "/placeholder.svg";   // public/placeholder.svg
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
                          ? "text-success"
                          : "text-destructive"
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
