"use client";

import {
  CandlestickData,
  CandlestickSeries,
  createChart,
  IChartApi,
  ISeriesApi,
  Time,
  PriceScaleMode,
} from "lightweight-charts";
import { useEffect, useRef } from "react";

type InitialChartData = [
  number, // Open time
  string, // Open
  string, // High
  string, // Low
  string, // Close
  string, // Volume
  number, // Close time
  string, // Quote asset volume
  number, // Number of trades
  string, // Taker buy base asset volume
  string, // Taker buy quote asset volume
  string // Ignore
];

interface CoinChartProps {
  initialData: InitialChartData[];
  symbol?: string;
}

export default function CoinChart({
  initialData,
  symbol = "btcusdt",
}: CoinChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<IChartApi | null>(null);
  const seriesInstance = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const lastCloseRef = useRef<number | null>(null);

  // 간단한 이상치 클램핑(±25%)
  const clampCandle = (prevClose: number | null, c: CandlestickData, pct = 0.25): CandlestickData => {
    const baseline = prevClose ?? c.open ?? c.close;
    const up = baseline * (1 + pct);
    const down = baseline * (1 - pct);

    const open = Math.min(Math.max(c.open, down), up);
    const close = Math.min(Math.max(c.close, down), up);
    const highRaw = Math.min(Math.max(c.high, down), up);
    const lowRaw = Math.min(Math.max(c.low, down), up);

    const high = Math.max(open, close, highRaw);
    const low = Math.min(open, close, lowRaw);

    return { time: c.time, open, high, low, close };
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1) 초기 데이터 포맷 + 이상치 제거
    let last = null as number | null;
    const formattedInitialData: CandlestickData[] = initialData.map((d) => {
      const c: CandlestickData = {
        time: Math.floor(d[0] / 1000) as Time,
        open: Number(d[1]),
        high: Number(d[2]),
        low: Number(d[3]),
        close: Number(d[4]),
      };
      const cleaned = clampCandle(last, c);
      last = cleaned.close;
      return cleaned;
    });

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: { background: { color: "#ffffff" }, textColor: "#111827" },
      grid: {
        vertLines: { color: "#f3f4f6" },
        horzLines: { color: "#f3f4f6" },
      },
      timeScale: { timeVisible: true, secondsVisible: false },
    });

    chart.priceScale("right").applyOptions({ mode: PriceScaleMode.Logarithmic });

    // 2) addSeries 사용
    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#16a34a",
      borderUpColor: "#16a34a",
      wickUpColor: "#16a34a",
      downColor: "#dc2626",
      borderDownColor: "#dc2626",
      wickDownColor: "#dc2626",
    });

    series.setData(formattedInitialData);
    lastCloseRef.current = formattedInitialData.at(-1)?.close ?? null;

    chartInstance.current = chart;
    seriesInstance.current = series;

    // 3) 바이낸스 멀티 스트림은 소문자 심볼
    const streamSymbol = symbol.toLowerCase();
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${streamSymbol}@kline_1m`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data?.data?.e !== "kline") return;

      const k = data.data.k;
      const raw: CandlestickData = {
        time: Math.floor(k.t / 1000) as Time,
        open: Number(k.o),
        high: Number(k.h),
        low: Number(k.l),
        close: Number(k.c),
      };

      const cleaned = clampCandle(lastCloseRef.current, raw);

      if (seriesInstance.current) {
        seriesInstance.current.update(cleaned);
        lastCloseRef.current = cleaned.close;
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    });
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      ws.close();
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [initialData, symbol]);

  return <div ref={chartContainerRef} className="w-full h-96" />;
}
