"use client";

import { connectTradeStream } from "@/lib/api/ws";
import {
  CandlestickData,
  createChart,
  IChartApi,
  ISeriesApi,
  Time,
  CandlestickSeries,
} from "lightweight-charts";
import { useEffect, useRef } from "react";

// 초기 차트 데이터의 타입 정의
type InitialChartData = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string,
  string
];

interface CoinChartProps {
  initialData: InitialChartData[];
}

export default function CoinChart({ initialData }: CoinChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<IChartApi | null>(null);
  const seriesInstance = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 초기 데이터 포맷 변환
    const formattedInitialData: CandlestickData[] = initialData.map((d) => ({
      time: Math.floor(d[0] / 1000) as Time, // Unix Timestamp (ms -> s)
      open: parseFloat(d[1]),
      high: parseFloat(d[2]),
      low: parseFloat(d[3]),
      close: parseFloat(d[4]),
    }));

    // 차트 생성
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "#111827" },
        textColor: "#cbd5e1",
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    });

    // 캔들스틱 시리즈 추가 및 데이터 설정
    const series = chart.addSeries(
      CandlestickSeries,
      {
        upColor: "rgba( 38, 166, 154, 1)",
        downColor: "rgba( 239, 83, 80, 1)",
        borderVisible: false,
        wickColor: "rgba( 38, 166, 154, 1)",
        wickDownColor: "rgba( 239, 83, 80, 1)",
      }
    );
    series.setData(formattedInitialData);

    chartInstance.current = chart;
    seriesInstance.current = series;

    // 리사이즈 대응
    const resizeObserver = new ResizeObserver(() => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    });
    resizeObserver.observe(chartContainerRef.current);

    // WebSocket 연결
    const ws = connectTradeStream("btcusdt", (data) => {
      // WebSocket 데이터 처리
      const tradePrice = parseFloat(data.p);
      const timeInSeconds = Math.floor(data.T / 1000);

      // 차트 시리즈가 존재하는지 확인
      if (seriesInstance.current) {
        seriesInstance.current.update({
          time: timeInSeconds as Time,
          open: tradePrice,
          high: tradePrice,
          low: tradePrice,
          close: tradePrice,
        });
      }
    });

    return () => {
      ws.close();
      resizeObserver.disconnect();
      if (chartInstance.current) {
        chartInstance.current.remove();
      }
    };
  }, [initialData]);

  return <div ref={chartContainerRef} className="w-full h-96" />;
}
