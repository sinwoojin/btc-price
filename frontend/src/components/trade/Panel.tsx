// src/components/trade/Panel.tsx

"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function TradePanel({ symbol }: { symbol: string }) {
  console.log("TradePanel received symbol:", symbol);
  const [price, setPrice] = useState<number | null>(null);
  const [inputQty, setInputQty] = useState("");
  const [isBuy, setIsBuy] = useState(true);

  useEffect(() => {
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`;

    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(parseFloat(data.p));
    };

    return () => {
      ws.close();
      console.log(`WebSocket closed for ${symbol}`);
    };
  }, [symbol]);

  const handleTrade = () => {
    if (!inputQty || !price) return;
    alert(
      `${symbol} ${
        isBuy ? "매수" : "매도"
      } 주문: ${inputQty} @ ${price.toLocaleString()} USDT`
    );
  };

  return (
    <div className="p-5 rounded-2xl bg-[#1b1b1b] border border-[#2b2b2b] shadow-lg flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-200">{symbol} 거래</h2>
        <p className="text-4xl font-bold text-white mt-2">
          {price ? price.toLocaleString() : "--"}
          <span className="text-sm text-gray-400 ml-1">USDT</span>
        </p>
      </div>

      <div className="flex justify-between bg-[#2a2a2a] rounded-xl px-4 py-3 items-center">
        <input
          type="number"
          value={inputQty}
          onChange={(e) => setInputQty(e.target.value)}
          placeholder="수량 입력 (BTC)"
          className="bg-transparent text-white placeholder-gray-500 w-full focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => {
            setIsBuy(true);
            handleTrade();
          }}
          className={`rounded-xl py-3 font-semibold ${
            isBuy
              ? "bg-[#26a17b] text-white hover:bg-[#1c7f5d]"
              : "bg-[#2a2a2a] text-gray-400 hover:text-gray-200"
          } transition`}
        >
          매수
        </Button>
        <Button
          onClick={() => {
            setIsBuy(false);
            handleTrade();
          }}
          className={`rounded-xl py-3 font-semibold ${
            !isBuy
              ? "bg-[#f6465d] text-white hover:bg-[#cc374a]"
              : "bg-[#2a2a2a] text-gray-400 hover:text-gray-200"
          } transition`}
        >
          매도
        </Button>
      </div>
    </div>
  );
}
