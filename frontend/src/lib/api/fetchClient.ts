
export async function fetchClient(input: string, init: RequestInit = {}) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}${input}`;

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
