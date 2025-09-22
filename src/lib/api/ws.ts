// src/lib/api/ws.ts

// const WS_URL = "wss://testnet.binance.vision/ws";
const WS_URL = "wss://stream.binance.com:9443/ws";

export const connectTradeStream = (
  symbol: string,
  onMessage: (data: string) => void
) => {
  const ws = new WebSocket(`${WS_URL}/${symbol.toLowerCase()}@trade`);
  ws.onmessage = (event) => onMessage(JSON.parse(event.data));
  ws.onclose = () => console.log("WS Disconnected");
  ws.onerror = (error) => console.error("WS Error:", error);
  return ws;
};
