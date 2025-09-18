// src/components/TickerDisplay.tsx
"use client";

import { CountingNumber } from "@/components/ui/CountingNumber";
import { connectTradeStream } from "@/lib/api/ws";
import { useEffect, useRef, useState } from "react";

export default function TickerDisplay() {
  const [price, setPrice] = useState(0);
  const [changePercentage, setChangePercentage] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const prevPriceRef = useRef(0);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 바이낸스 WebSocket 스트림에 연결
    const ws = connectTradeStream("btcusdt", (data) => {
      const newPrice = parseFloat(data.p);
      const prevPrice = prevPriceRef.current;

      // 이전 가격과 현재 가격을 비교하여 퍼센트 변화율 계산
      if (prevPrice !== 0) {
        const percentageChange = ((newPrice - prevPrice) / prevPrice) * 100;
        setChangePercentage(percentageChange);
      }

      setPrice(newPrice);
      prevPriceRef.current = newPrice;
    });

    wsRef.current = ws;

    // 컴포넌트 언마운트 시 WebSocket 연결 종료
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // 가격 변화에 따라 글자 색상 결정
  const priceColor =
    changePercentage > 0
      ? "text-green-500"
      : changePercentage < 0
      ? "text-red-500"
      : "text-white";

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
