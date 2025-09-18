// src/app/(main)/page.tsx

import CoinChart from "@/components/charts/CoinChart";
import TickerDisplay from "@/components/TickerDisplay";
import { getKlineData } from "@/lib/api/binance";

export default async function HomePage() {
  // 서버에서 캔들스틱(차트) 데이터를 불러옵니다.
  // 이 데이터는 공개 정보이므로 보안 문제가 없습니다.
  const initialKlineData = await getKlineData("BTCUSDT", "1d");
  console.log("initialKlineData:", initialKlineData);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* 실시간 시세를 보여주는 컴포넌트 */}
      <div className="mb-8">
        <TickerDisplay />
      </div>

      {/* 차트 데이터를 props로 전달 */}
      <div className="w-full lg:w-4/5">
        <CoinChart initialData={initialKlineData} />
      </div>
    </div>
  );
}
