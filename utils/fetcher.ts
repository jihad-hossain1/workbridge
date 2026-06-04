const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export const fetcher = (url: string) =>
  fetch(baseUrl + url).then((res) => res.json());
