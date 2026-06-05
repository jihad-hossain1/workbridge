import { useAuthStore } from "@/hooks/useAuthStore";

const _baseUrl = process.env.NEXT_PUBLIC_API_URL!;

class FetchService {
  private async request<T>(
    method: string,
    path: string,
    data?: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    const url = path;
    // const url = _baseUrl + path;
    const token = useAuthStore.getState().accessToken;
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
        ...headers,
      } as Record<string, string>,
      body: data ? JSON.stringify(data) : undefined,
    };

    try {
      const response = await fetch(url, config);

      const result = (await response.json()) as T;
      return result;
    } catch (error) {
      console.error("FetchService Error:", error);
      throw error;
    }
  }

  /**
   * HTTP GET request
   * @param path API endpoint path
   * @param headers Optional headers
   */
  get<T>(path: string, headers?: Record<string, string>) {
    return this.request<T>("GET", path, undefined, headers);
  }

  /**
   * HTTP POST request
   * @param path API endpoint path
   * @param data Optional data to send
   * @param headers Optional headers
   */
  post<T>(path: string, data?: any, headers?: Record<string, string>) {
    return this.request<T>("POST", path, data, headers);
  }

  /**
   * HTTP PUT request
   * @param path API endpoint path
   * @param data Optional data to send
   * @param headers Optional headers
   */
  put<T>(path: string, data?: any, headers?: Record<string, string>) {
    return this.request<T>("PUT", path, data, headers);
  }

  /**
   * HTTP PATCH request
   * @param path API endpoint path
   * @param data Optional data to send
   * @param headers Optional headers
   */
  patch<T>(path: string, data?: any, headers?: Record<string, string>) {
    return this.request<T>("PATCH", path, data, headers);
  }

  /**
   * HTTP DELETE request
   * @param path API endpoint path
   * @param headers Optional headers
   */
  delete<T>(path: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>("DELETE", path, body, headers);
  }
}

export default new FetchService();
