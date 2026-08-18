const API_URL = "http://127.0.0.1:8000/api";

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const isFormData = options?.body instanceof FormData;
  const token =
    localStorage.getItem("admin_token") ?? localStorage.getItem("cliente_token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,

    headers: {
      ...(isFormData
        ? {}
        : {
            "Content-Type": "application/json",
          }),

      ...(token ? { Authorization: `Bearer ${token}` } : {}),

      ...options?.headers,
    },
  });

  if (!response.ok) {
    let body = "";

    try {
      body = await response.text();
    } catch {
      // No hacemos nada
    }

    console.error("❌ ERROR API:", {
      status: response.status,
      statusText: response.statusText,
      body,
    });

    let detail = "";
    try {
      const parsed = JSON.parse(body) as { detail?: string };
      detail = parsed.detail ?? "";
    } catch {
      detail = body;
    }

    throw new Error(detail || `Error ${response.status}: ${response.statusText}`);
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getMediaUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `http://127.0.0.1:8000${url}`;
}
