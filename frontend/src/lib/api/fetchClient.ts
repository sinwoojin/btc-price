export const BASE_URL = "http://localhost:5000/api/v1";

export async function fetchClient(input: string, init?: RequestInit) {
  const url = `${BASE_URL}${input}`;
  const response = await fetch(url, init);
  return response;
}
