import { NextRequest } from "next/server";

// WebSocket 연결 상태를 저장할 전역 변수
let binanceWS: WebSocket | null = null;
let clients: Set<WebSocket> = new Set();

export async function GET(req: NextRequest) {
  // Upgrade 요청만 처리
  const { socket } = req as any;
  if (!socket) {
    return new Response("WebSocket only", { status: 400 });
  }

  // 클라이언트 WebSocket 생성
  const [client, server] = Object.values(new WebSocket.WebSocketPair());
  clients.add(server as any);

  server.accept();

  // Binance WebSocket 연결 없으면 새로 생성
  if (!binanceWS) {
    binanceWS = new WebSocket(
      "wss://testnet.binance.vision/ws/btcusdt@kline_1m"
    );

    binanceWS.on("open", () => console.log("✅ Connected to Binance WS"));
    binanceWS.on("message", (msg) => {
      for (const c of clients) {
        try {
          c.send(msg.toString());
        } catch {
          clients.delete(c);
        }
      }
    });
    binanceWS.on("close", () => {
      console.log("🔌 Binance WS Closed");
      binanceWS = null;
    });
  }

  // 클라이언트 닫힐 때 정리
  server.addEventListener("close", () => {
    clients.delete(server as any);
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}
