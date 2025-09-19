// src/app/(main)/page.tsx

import CoinChart from "@/components/charts/CoinChart";
import TickerDisplay from "@/components/TickerDisplay";
import { getKlineData } from "@/lib/api/binance";

export default async function HomePage() {
  const initialKlineData = await getKlineData("BTCUSDT", "1d");

  const initialOpenPrice = parseFloat(initialKlineData[0][1]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <TickerDisplay initialOpenPrice={initialOpenPrice} />
      </div>
      <div className="w-full lg:w-4/5">
        <CoinChart initialData={initialKlineData} />
      </div>
    </div>
  );
}
