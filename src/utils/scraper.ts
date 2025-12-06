import * as cheerio from "cheerio";
import type { CuimpHttp, CuimpRequestConfig } from "cuimp";
import type { SERPQueryParams, SERPResponse } from "../types/serp";
import buildUrl from "../utils/buildUrls";

type ScraperOptions = {
    engine: string;
    baseUrl: string;
    resultSelector: string;
    parseItem: ($el: any) => { title: string; url: string; snippet?: string };
};

export async function scrapeEngine(
    client: CuimpHttp,
    queryParams: SERPQueryParams,
    { engine, baseUrl, resultSelector, parseItem }: ScraperOptions,
    headers?: Record<string, string | boolean | number>,
    proxy?: string
): Promise<SERPResponse> {
    const urls = buildUrl(baseUrl, queryParams);

    const result: SERPResponse = {
        engine,
        query: queryParams.query,
        page: queryParams.page,
        results: [],
    };

    const requestOptions: CuimpRequestConfig = {};
    if (headers) requestOptions.headers = headers;
    if (proxy) requestOptions.proxy = proxy;

    for (const url of urls) {
        try {
            const response = await client.get(url, requestOptions);
            const $ = cheerio.load(response.data);

            $(resultSelector).each((i, el) => {
                const $el = $(el);
                const item = parseItem($el);
                result.results.push({ ...item, position: i + 1 });
            });
        } catch (error: any) {
            console.error(`Error fetching ${url}:`, error.message ?? error);
        }
    }

    return result;
}
