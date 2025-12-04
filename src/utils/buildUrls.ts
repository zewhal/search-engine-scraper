import type { SERPQueryParams } from "../types/serp";

export default function buildUrls(baseUrl: string, queryParams: SERPQueryParams): string[] {
  const urls: string[] = [];
  const start = queryParams.pageStart ?? 0;

  if (queryParams.page <= 0) return [];

  for (let i = 0; i < queryParams.page; i++) {
    const pageValue = i + start;

    const url = baseUrl
      .replace("{query}", encodeURIComponent(queryParams.query))
      .replace("{page}", String(pageValue));

    urls.push(url);
  }

  return urls;
}
