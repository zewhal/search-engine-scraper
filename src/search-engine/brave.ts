import type { CuimpHttp } from "cuimp";
import type { SERPQueryParams, SERPResponse } from "../types/serp";
import { scrapeEngine } from "../utils/scraper";

export async function brave(
    client: CuimpHttp, 
    queryParams: SERPQueryParams,
    header?: Record<string, string | boolean | number>,
    proxy?: string
): Promise<SERPResponse> {
    return scrapeEngine(client, queryParams, {
        engine: "brave",
        baseUrl: "https://search.brave.com/search?q={query}&offset={page}&spellcheck=0",
        resultSelector: "div.snippet.svelte-jmfu5f:not(.standalone)",
        parseItem: ($el: any) => ({
            title: $el.find("div.title.search-snippet-title.line-clamp-1.svelte-14r20fy").text().trim(),
            url: $el.find("a.svelte-14r20fy.l1").attr("href") ?? "",
            snippet: $el.find("div.generic-snippet.svelte-1cwdgg3").text().trim(),
        }),
    }, header, proxy);
}