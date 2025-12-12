"use client";

import { useWallet } from "@/context/WalletContext";
import { fetchClient } from "@/lib/api/fetchClient";
import { useTheme } from "@/lib/utils/theme-context";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function TradePanel({ symbol }: { symbol: string }) {
  const [price, setPrice] = useState<number | null>(null);
  const [inputQty, setInputQty] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const { portfolio, refreshPortfolio } = useWallet();
  const isDark = theme === "dark";

  useEffect(() => {
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(parseFloat(data.p));
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  const handleTrade = async (type: 'BUY' | 'SELL') => {
    if (!inputQty || !price) return;
    
    const amount = parseFloat(inputQty);
    const totalValue = amount * price;

    if (type === 'BUY') {
      if (portfolio && portfolio.balance < totalValue) {
        setError("잔액이 부족합니다.");
        return;
      }
    } else {
      // SELL
      const currentHolding = portfolio?.holdings.find((h) => h.coinId === symbol);
      if (!currentHolding || currentHolding.amount < amount) {
        setError("보유 수량이 부족합니다.");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const endpoint = type === 'BUY' ? "/wallet/buy" : "/wallet/sell";
      const response = await fetchClient(endpoint, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coinId: symbol,
          amount: amount,
          price: price,
        }),
      });

      if (response.ok) {
        alert(`${type === 'BUY' ? "매수" : "매도"} 성공!`);
        setInputQty("");
        refreshPortfolio(); // 잔액 갱신
      } else {
        const data = await response.json();
        setError(data.message || `${type === 'BUY' ? "매수" : "매도"} 실패`);
      }
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
      console.error("Failed to trade:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentHolding = portfolio?.holdings.find((h) => h.coinId === symbol);

  return (
    <div className={`p-5 rounded-2xl border shadow-lg flex flex-col gap-6 ${
      isDark ? "bg-[#1b1b1b] border-[#2b2b2b]" : "bg-white border-gray-200"
    }`}>
      <div>
        <h2 className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
          {symbol} 거래
        </h2>
        <p className={`text-4xl font-bold mt-2 ${isDark ? "text-white" : "text-black"}`}>
          {price ? price.toLocaleString() : "--"}
          <span className="text-sm text-gray-400 ml-1">USDT</span>
        </p>
      </div>

      {/* 지갑 정보 */}
      <div className={`p-4 rounded-xl ${isDark ? "bg-[#2a2a2a]" : "bg-gray-100"}`}>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500 text-sm">보유 현금</span>
          <span className={`font-medium ${isDark ? "text-white" : "text-black"}`}>
            {portfolio ? Math.floor(portfolio.balance).toLocaleString() : 0} USDT
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">보유 수량</span>
          <span className={`font-medium ${isDark ? "text-white" : "text-black"}`}>
            {currentHolding ? currentHolding.amount : 0} {symbol.replace("USDT", "")}
          </span>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded-lg">
          {error}
        </div>
      )}

      <div className={`flex justify-between rounded-xl px-4 py-3 items-center border ${
        isDark ? "bg-[#2a2a2a] border-transparent" : "bg-white border-gray-300"
      }`}>
        <input
          type="number"
          value={inputQty}
          onChange={(e) => setInputQty(e.target.value)}
          placeholder="수량 입력"
          className={`bg-transparent w-full focus:outline-none ${
            isDark ? "text-white placeholder-gray-500" : "text-black placeholder-gray-400"
          }`}
        />
        <span className="text-gray-500 text-sm whitespace-nowrap ml-2">
          {symbol.replace("USDT", "")}
        </span>
      </div>

      {/* 예상 가격 */}
      {price && inputQty && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">총 주문 금액</span>
          <span className={isDark ? "text-white" : "text-black"}>
            {(parseFloat(inputQty) * price).toLocaleString()} USDT
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => handleTrade('BUY')}
          disabled={loading || !price || !inputQty}
          className={`rounded-xl py-3 font-semibold text-white transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
          } bg-[#26a17b]`}
        >
          {loading ? "처리중..." : "매수"}
        </Button>
        <Button
          onClick={() => handleTrade('SELL')}
          disabled={loading || !price || !inputQty}
          className={`rounded-xl py-3 font-semibold text-white transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
          } bg-[#f6465d]`}
        >
          {loading ? "처리중..." : "매도"}
        </Button>
      </div>
    </div>
  );
}
