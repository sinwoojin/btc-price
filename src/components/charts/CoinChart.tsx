"use client";

import {
  CandlestickData,
  CandlestickSeries,
  createChart,
  IChartApi,
  ISeriesApi,
  Time,
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

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const formattedInitialData: CandlestickData[] = initialData.map((d) => ({
      time: Math.floor(d[0] / 1000) as Time,
      open: Number(d[1]),
      high: Number(d[2]),
      low: Number(d[3]),
      close: Number(d[4]),
      volume: Number(d[5]),
      closeTime: Math.floor(d[6] / 1000) as Time,
      quoteAssetVolume: Number(d[7]),
      numberOfTrades: d[8],
      takerBuyBaseAssetVolume: Number(d[9]),
      takerBuyQuoteAssetVolume: Number(d[10]),
      ignore: d[11],
    }));

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#111827",
      },
      grid: {
        vertLines: { color: "#f3f4f6" },
        horzLines: { color: "#f3f4f6" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#16a34a",
      borderUpColor: "#16a34a",
      wickUpColor: "#16a34a",
      downColor: "#dc2626",
      borderDownColor: "#dc2626",
      wickDownColor: "#dc2626",
    });

    series.setData(formattedInitialData);

    chartInstance.current = chart;
    seriesInstance.current = series;

    const ws = new WebSocket(
      `wss://testnet.binance.vision/stream?streams=${symbol.toLowerCase()}@kline_1m`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data?.data?.e === "kline") {
        const k = data.data.k;
        const newCandle: CandlestickData = {
          time: Math.floor(k.t / 1000) as Time,
          open: Number(k.o),
          high: Number(k.h),
          low: Number(k.l),
          close: Number(k.c),
        };

        if (seriesInstance.current) {
          seriesInstance.current.update(newCandle);
        }
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
