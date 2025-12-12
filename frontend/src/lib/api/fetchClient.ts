import { BASE_URL } from "@/config/api";

export async function fetchClient(input: string, init: RequestInit = {}) {
  const url = `${BASE_URL}${input}`;

  // Check if we're in browser environment before accessing localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
  console.log("token", token);

  const headers = new Headers();

  headers.set("Content-Type", "application/json");

  if (init.headers) {
    const initHeaders = new Headers(init.headers as HeadersInit);
    initHeaders.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  console.log("sending headers:", [...headers.entries()]);

  return fetch(url, {
    ...init,
    headers,
  });
}
