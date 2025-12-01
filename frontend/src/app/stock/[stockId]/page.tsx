// src/app/(main)/[symbol]/page.tsx

import TradingViewWidget from "@/components/charts/TradingViewWidget";
import ThemeAwareContainer from "@/components/ThemeAwareContainer";
import TradePanel from "@/components/trade/Panel";

export default async function StockPage({
  params,
}: {
  params: Promise<{ stockId: string }>;
}) {
  const { stockId } = await params;

  if (!stockId) {
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
      <div className="flex flex-col lg:flex-row justify-center items-start gap-6 p-6 h-[calc(100vh-68px)]">
        <div className="flex-1">
          <TradingViewWidget symbol={stockId} />
        </div>
        <div className="w-full lg:w-[360px]">
          <TradePanel symbol={stockId} />
        </div>
      </div>
    </ThemeAwareContainer>
  );
}
