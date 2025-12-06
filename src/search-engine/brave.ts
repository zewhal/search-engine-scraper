import * as cheerio from "cheerio";
import type { CuimpHttp, CuimpRequestConfig } from "cuimp";
import type { SERPQueryParams, SERPResponse } from "../types/serp";
import buildUrl from "../utils/buildUrls";


export async function brave(
    client: CuimpHttp, 
    queryParams: SERPQueryParams,
    header?: Record<string, string | boolean | number>,
    proxy?: string
): Promise<SERPResponse> {
    
    const baseUrl = "https://search.brave.com/search?q={query}&offset={page}&spellcheck=0"
    const urls = buildUrl(baseUrl, queryParams)

    let result: SERPResponse = {
        engine: "brave",
        query: queryParams.query,
        page: queryParams.page,
        results: []
    }

    const requestOptions: CuimpRequestConfig = {}

    if (header) {
        requestOptions.headers = header;
    }
    if (proxy) {
        requestOptions.proxy = proxy;
    }

    for(const url of urls){
        try{
            const response = await client.get(url, requestOptions);
            const $ = cheerio.load(response.data);

            $("div.snippet.svelte-jmfu5f:not(.standalone)").each((i,el) => {
                const $el = $(el);
                const title = $el.find("div.title.search-snippet-title.line-clamp-1.svelte-14r20fy").text().trim()
                const url = $el.find("a.svelte-14r20fy.l1").attr("href") ?? ""
                const snippet = $el.find("div.generic-snippet.svelte-1cwdgg3").text().trim()

                result.results.push({
                    title,
                    url,
                    snippet,
                    position: i + 1,
                });
            })
        }catch (error: any){
            console.error(`Error fetching ${url}: `, error.message ?? error)
        }
    }
    return result;
}