import { useAuthStore } from "@/hooks/useAuthStore";
import useSWR from "swr";

export function useSwrFetch<T>(apiUrl: string | null) {
  const { accessToken } = useAuthStore();

  // Use both URL and accessToken in key so SWR automatically re-fetches when token hydrates.
  // We return null if accessToken is not yet available, preventing unauthenticated 401 calls on page load/reload.
  const key = apiUrl && accessToken ? [apiUrl, accessToken] : null;

  return useSWR<T>(key, async ([url, token]: [string, string]) => {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody?.message || `Request failed with status ${res.status}`);
    }

    return res.json();
  });
}

