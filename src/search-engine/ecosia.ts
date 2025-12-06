import type { CuimpHttp } from "cuimp";
import type { SERPQueryParams, SERPResponse } from "../types/serp";
import { scrapeEngine } from "../utils/scraper";

export async function ecosia(
    client: CuimpHttp,
    queryParams: SERPQueryParams,
    header?: Record<string, string | boolean | number>,
    proxy?: string
): Promise<SERPResponse> {
    return scrapeEngine(client, queryParams, {
        engine: "Ecosia",
        baseUrl: "https://www.ecosia.org/search?method=index&q={query}&p={page}",
        resultSelector: "article[data-test-id='organic-result']",
        parseItem: ($el) => ({
            title: $el.find("h2[data-test-id='result-title']").text().trim(),
            url: $el.find("a[data-test-id='result-link']").attr("href") ?? "",
            snippet:
                $el.find("p[data-test-id='web-result-description']").text().trim() ||
                $el.find("[data-test-id='result-description']").text().trim() ||
                undefined,
        }),
    }, header, proxy);
}