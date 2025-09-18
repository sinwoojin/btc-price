// src/app/api/binance/account/route.ts (새로 생성할 파일)

import crypto from "crypto";
import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_BINANCE_API_KEY;
const API_SECRET = process.env.NEXT_PUBLIC_BINANCE_API_SECRET;
const BASE_URL = "https://testnet.binance.vision/api/v3";

// 환경 변수 값 확인용 console.log 추가
console.log("API Key:", API_KEY ? "Loaded" : "Not Loaded");
console.log("API Secret:", API_SECRET ? "Loaded" : "Not Loaded");

export async function GET() {
  try {
    if (!API_KEY || !API_SECRET) {
      return NextResponse.json(
        { error: "API keys are not configured" },
        { status: 500 }
      );
    }

    const timestamp = Date.now();
    const query = `timestamp=${timestamp}`;
    const signature = crypto
      .createHmac("sha256", API_SECRET)
      .update(query)
      .digest("hex");

    const url = `${BASE_URL}/account?${query}&signature=${signature}`;
    const res = await fetch(url, {
      headers: {
        "X-MBX-APIKEY": API_KEY,
        credentials: "include",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: "Failed to fetch from Binance", details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
