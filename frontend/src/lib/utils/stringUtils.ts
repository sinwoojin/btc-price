/**
 * 토큰 심볼에서 "USDT"와 "ETH" 같은 주요 접미사를 제거합니다.
 * @example cleanTokenSymbol("BTCUSDT") -> "BTC"
 * @example cleanTokenSymbol("LTCETH") -> "LTC"
 * @example cleanTokenSymbol("ETHUSDT") -> "ETH"
 */
export function cleanTokenSymbol(symbol: string): string {
  return symbol.replace(/(USDT|BUSD|ETH|KRW|USDC)$/i, "");
}
