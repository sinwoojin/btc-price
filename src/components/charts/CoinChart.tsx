"use client";

import {
  CandlestickSeries,
  CandlestickData,
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

  const clampCandle = (
    prevClose: number | null,
    candle: CandlestickData,
    pct = 0.25
  ): CandlestickData => {
    const baseline = prevClose ?? candle.open ?? candle.close;
    const range = [baseline * (1 - pct), baseline * (1 + pct)];

    const open = Math.min(Math.max(candle.open, range[0]), range[1]);
    const close = Math.min(Math.max(candle.close, range[0]), range[1]);
    const high = Math.max(open, close, Math.min(Math.max(candle.high, range[0]), range[1]));
    const low = Math.min(open, close, Math.min(Math.max(candle.low, range[0]), range[1]));

    return { time: candle.time, open, high, low, close };
  };

  const formatInitialData = (data: InitialChartData[]): CandlestickData[] => {
    let lastClose: number | null = null;
    return data.map((d) => {
      const candle: CandlestickData = {
        time: Math.floor(d[0] / 1000) as Time,
        open: Number(d[1]),
        high: Number(d[2]),
        low: Number(d[3]),
        close: Number(d[4]),
      };
      const cleanedCandle = clampCandle(lastClose, candle);
      lastClose = cleanedCandle.close;
      return cleanedCandle;
    });
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const formattedData = formatInitialData(initialData);

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

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#16a34a",
      borderUpColor: "#16a34a",
      wickUpColor: "#16a34a",
      downColor: "#dc2626",
      borderDownColor: "#dc2626",
      wickDownColor: "#dc2626",
    });

    series.setData(formattedData);
    lastCloseRef.current = formattedData.at(-1)?.close ?? null;

    chartInstance.current = chart;
    seriesInstance.current = series as ISeriesApi<"Candlestick">;

    const ws = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${symbol.toLowerCase()}@kline_1m`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data?.data?.e !== "kline") return;

      const k = data.data.k;
      const newCandle: CandlestickData = {
        time: Math.floor(k.t / 1000) as Time,
        open: Number(k.o),
        high: Number(k.h),
        low: Number(k.l),
        close: Number(k.c),
      };

      const cleanedCandle = clampCandle(lastCloseRef.current, newCandle);

      if (seriesInstance.current) {
        seriesInstance.current.update(cleanedCandle);
        lastCloseRef.current = cleanedCandle.close;
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
