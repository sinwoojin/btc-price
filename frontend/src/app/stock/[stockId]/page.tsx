"use client";
// src/app/(main)/[symbol]/page.tsx

import TradingViewWidget from "@/components/charts/TradingViewWidget";
import ThemeAwareContainer from "@/components/ThemeAwareContainer";
import TradePanel from "@/components/trade/Panel";
import { useParams } from "next/navigation";

// Next.js 다이나믹 라우트에서 URL 파라미터를 받습니다.
export default function StockPage() {
  // TODO: btc등 형태 해제 후 받아오기
  const { stockId: tradingSymbol } = useParams();

  console.log("Trading Symbol:", tradingSymbol);

  // 1. 초기 데이터 검증 및 로딩 (선택 사항이지만 안정성 위해 추천)
  //   API 호출 대신 Symbol의 유효성 검사 로직을 넣거나,
  //   API 호출이 실패할 경우 (예: 404)를 처리할 수 있습니다.
  // const initialKlineData = await getKlineData(tradingSymbol, "1d");
  // if (!initialKlineData || initialKlineData.length === 0) {
  //   // 코드가 없으면 404 페이지를 띄웁니다.
  //   notFound();
  // }

  // initialKlineData는 TradingViewWidget과 TradePanel에서 실시간 데이터로 대체되어 주석 처리
  // const initialOpenPrice = parseFloat(initialKlineData[0][1]);

  if (!tradingSymbol) {
    return (
      <ThemeAwareContainer>
        <div className="p-6 text-center text-red-500">
          유효하지 않은 심볼입니다.
        </div>
      </ThemeAwareContainer>
    );
  }

  return (
    <ThemeAwareContainer>
      <div className="flex flex-col lg:flex-row justify-center items-start gap-6 p-6">
        <div className="flex-1">
          {/* 2. TradingViewWidget에 symbol 전달 */}
          <TradingViewWidget symbol={tradingSymbol} />
        </div>
        <div className="w-full lg:w-[360px]">
          {/* 3. TradePanel에 symbol 전달 */}
          <TradePanel symbol={tradingSymbol} />
        </div>
      </div>
    </ThemeAwareContainer>
  );
}

// Next.js 13+에서 다이나믹 라우트를 사용하려면 generateStaticParams를 사용하여
// 어떤 경로를 미리 생성할지 지정하거나, 없애서 모든 요청을 동적으로 처리하게 할 수 있습니다.
// 여기서는 동적으로 처리하도록 별도 함수를 추가하지 않습니다.
