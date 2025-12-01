import { BASE_URL } from "@/config/api";

export async function fetchClient(input: string, init?: RequestInit) {
  const url = `${BASE_URL}${input}`;
  console.log(`Fetching: ${url}`);
  const response = await fetch(url, init);
  return response;
}
