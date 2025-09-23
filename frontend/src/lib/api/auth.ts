// src/lib/api/auth.ts

import { fetchClient } from "./fetchClient";

export async function refreshAccessTokenAPI(): Promise<string> {
  try {
    // fetchWithAuth 대신 fetchClient를 사용하여 순환 참조 방지
    const response = await fetchClient("/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 리프레시 토큰이 담긴 쿠키를 포함
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    const newAccessToken = data.accessToken;

    if (!newAccessToken) {
      throw new Error("New access token not found in response");
    }

    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
}
