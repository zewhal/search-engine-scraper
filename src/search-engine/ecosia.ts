import * as cheerio from "cheerio";
import type { CuimpHttp, CuimpRequestConfig } from "cuimp";
import type { SERPQueryParams, SERPResponse } from "../types/serp";
import buildUrl from "../utils/buildUrls";

export async function ecosia(
    client: CuimpHttp,
    queryParams: SERPQueryParams,
    header?: Record<string, string | boolean | number>,
    proxy?: string
): Promise<SERPResponse> {
    const baseUrl = "https://www.ecosia.org/search?method=index&q={query}&p={page}";
    const urls = buildUrl(baseUrl, queryParams);

    let result: SERPResponse = {
        engine: "Ecosia",
        query: queryParams.query,
        page: queryParams.page,
        results: []
    };
    
    const requestOptions: CuimpRequestConfig = {}

    if (header) {
        requestOptions.headers = header;
    }
    if (proxy) {
        requestOptions.proxy = proxy;
    }

    for (const url of urls) {
        try {
            const response = await client.get(url, requestOptions);
            const $ = cheerio.load(response.data);

            $("article[data-test-id='organic-result']").each((i, el) => {
                const $el = $(el);
                const title = $el.find("h2[data-test-id='result-title']").text().trim();
                const url = $el.find("a[data-test-id='result-link']").attr("href") ?? "";
                const snippet =
                    $el.find("p[data-test-id='web-result-description']").text().trim() ||
                    $el.find("[data-test-id='result-description']").text().trim() ||
                    undefined;

                result.results.push({
                    title,
                    url,
                    snippet,
                    position: i + 1,
                });
            });
        } catch (error: any) {
            console.error(`Error fetching ${url}:`, error.message ?? error);
        }
    }
    return result;
}