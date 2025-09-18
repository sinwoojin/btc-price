const BASE_URL = "https://testnet.binance.vision/api/v3";

// 캔들스틱 데이터 함수는 그대로 사용
export async function getKlineData(symbol: string, interval: string) {
  const url = `${BASE_URL}/klines?symbol=${symbol}&interval=${interval}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch kline data");
  return await res.json();
}

// 잔고(account) 정보 함수 (서명 추가)
const LOCAL_API_URL = "http://localhost:3000"; // 또는 배포된 서버 주소

export async function getAccountInfo() {
  // 이제 API 키와 시크릿은 필요 없습니다.
  // 클라이언트는 안전한 우리 서버의 엔드포인트를 호출합니다.
  const res = await fetch(`${LOCAL_API_URL}/api/binance/account`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch account info from local API");
  return await res.json();
}
