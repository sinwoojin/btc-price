"use client";

import { CountingNumber } from "@/components/ui/CountingNumber";
import { connectTradeStream } from "@/lib/api/ws";
import { useEffect, useRef, useState } from "react";

// props 타입 정의
interface TickerDisplayProps {
  initialOpenPrice: number;
}

interface TradeMessage {
  p: string; // price
}


export default function TickerDisplay({
  initialOpenPrice,
}: TickerDisplayProps) {
  const [price, setPrice] = useState(initialOpenPrice);
  const [changePercentage, setChangePercentage] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    setPrice(initialOpenPrice);

    const ws = connectTradeStream("btcusdt", (data: TradeMessage) => {
      const newPrice = parseFloat(data.p);
      setPrice(newPrice);

      // 오늘의 시가와 현재가를 비교하여 변화율 계산
      const percentageChange =
        ((newPrice - initialOpenPrice) / initialOpenPrice) * 100;
      setChangePercentage(percentageChange);
    });

    wsRef.current = ws;

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [initialOpenPrice]);

  const priceColor =
    changePercentage > 0
      ? "text-green-500"
      : changePercentage < 0
      ? "text-red-500"
      : "text-gray-400";

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-2">BTC/USDT 실시간 시세</h2>
      <div className={`text-5xl font-extrabold ${priceColor}`}>
        $<CountingNumber value={price} />
      </div>
      <div className={`text-md font-medium mt-2 ${priceColor}`}>
        <CountingNumber value={changePercentage} toFixed={2} />%
      </div>
    </div>
  );
}
