import { BASE_URL } from "@/config/api";
import { refreshAccessTokenAPI } from "./auth";

let isRefreshing = false;
let failedQueue: {
  resolve: (value: string) => Promise<void>;
  reject: <T>(reason?: T) => void;
}[] = [];

const processQueue = (error: unknown | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  });
  failedQueue = [];
};

export async function fetchWithAuth(
  input: string,
  accessToken: string | null, // 액세스 토큰을 인자로 받음
  setAccessToken: (token: string) => void, // 토큰 설정 함수를 인자로 받음
  clearAccessToken: () => void, // 토큰 제거 함수를 인자로 받음
  init?: RequestInit
) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || BASE_URL}${input}`;

  const requestHeaders = new Headers(init?.headers);
  if (accessToken) {
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  const requestInit: RequestInit = {
    ...init,
    headers: requestHeaders,
    credentials: "include",
  };

  try {
    const response = await fetch(url, requestInit);

    if (response.status !== 401) {
      return response;
    }

    if (isRefreshing) {
      return new Promise<Response>((resolve, reject) => {
        failedQueue.push({
          resolve: async (token: string) => {
            const retryHeaders = new Headers(init?.headers);
            retryHeaders.set("Authorization", `Bearer ${token}`);

            try {
              const retryResponse = await fetch(url, {
                ...init,
                headers: retryHeaders,
                credentials: "include",
              });
              resolve(retryResponse);
            } catch (err) {
              reject(err);
            }
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const newToken = await refreshAccessTokenAPI();
      setAccessToken(newToken);
      processQueue(null, newToken);

      const retryHeaders = new Headers(init?.headers);
      retryHeaders.set("Authorization", `Bearer ${newToken}`);

      return await fetch(url, {
        ...init,
        headers: retryHeaders,
        credentials: "include",
      });
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAccessToken();
      window.location.href = "/login";
      throw refreshError;
    } finally {
      isRefreshing = false;
    }
  } catch (error) {
    throw error;
  }
}
