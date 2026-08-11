const API_URL = "http://127.0.0.1:8000/api";

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const headers = new Headers(options?.headers);

  // Solo enviar JSON cuando el body NO sea FormData
  if (!(options?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error("❌ ERROR API:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });

    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export function getMediaUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `http://127.0.0.1:8000${url}`;
}
