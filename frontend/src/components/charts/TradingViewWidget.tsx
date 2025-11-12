// src/components/charts/TradingViewWidget.tsx

"use client";

import { memo, useEffect, useRef } from "react";

// symbol prop을 받도록 수정
function TradingViewWidget({ symbol }: { symbol: string }) {
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML =
        '<div class="tradingview-widget-container__widget"></div><div class="tradingview-widget-copyright"></div>';
    }

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    const tradingViewSymbol = `BINANCE:${symbol.replace("USDT", "USD")}`;

    script.innerHTML = `
      {
        "allow_symbol_change": true,
        "calendar": false,
        "details": false,
        "hide_side_toolbar": true,
        "hide_top_toolbar": false,
        "hide_legend": false,
        "hide_volume": false,
        "hotlist": false,
        "interval": "D",
        "locale": "kr",
        "save_image": true,
        "style": "1",
        "symbol": "${tradingViewSymbol}",
        "theme": "dark",
        "timezone": "Etc/UTC",
        "backgroundColor": "#282525",
        "gridColor": "rgba(46, 46, 46, 0.06)",
        "watchlist": [],
        "withdateranges": false,
        "compareSymbols": [],
        "studies": [],
        "height": 610
      }`;

    if (container.current) {
      container.current.appendChild(script);
    }
  }, [symbol]);

  const linkSymbol = symbol.replace("USDT", "USD");

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a
          href={`https://www.tradingview.com/symbols/${linkSymbol}/?exchange=BINANCE`}
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">{linkSymbol} chart</span>
        </a>
        <span className="trademark"> by TradingView</span>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
