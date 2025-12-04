import { type Page } from "patchright";
import type { SERPResponse, SERPResultItem, SERPQueryParams } from "../types/serp";

async function humanScroll(page: Page) {
    while (true) {
        const scrollDistance = Math.floor(Math.random() * (1200 - 300) + 300);
        await page.mouse.wheel(0, scrollDistance);

        await page.waitForTimeout(Math.floor(Math.random() * (1200 - 200) + 200));

        const noMore = await page.$eval(
            'span',
            (nodes) => Array.from(document.querySelectorAll('span')).some(span =>
                span.textContent?.includes("No more results found for")
            ),
        ).catch(() => false);

        if (noMore) break;

        const moreButton = await page.$('#more-results');
        if (moreButton) {
            await moreButton.click();
            await page.waitForTimeout(1500);
        }
    }
}


export async function duckduckgo(page: Page, queryParams: SERPQueryParams): Promise<SERPResponse> {
    const baseUrl = `https://duckduckgo.com/?q=${encodeURIComponent(queryParams.query)}&t=h_&ia=web`;

    let result: SERPResponse = {
        engine: "duckduckgo",
        query: queryParams.query,
        page: queryParams.page,
        results: []
    };

    try {
        await page.goto(baseUrl, { waitUntil: "load" });
        await page.waitForSelector('article[data-testid="result"]');

        await humanScroll(page);

        const items = await page.$$eval(
            'article[data-testid="result"]',
            (nodes) =>
                nodes.map((el, index) => {
                    const title =
                        el.querySelector('h2 a[data-testid="result-title-a"]')?.textContent?.trim() ?? "";

                    const url =
                        el.querySelector('a[data-testid="result-extras-url-link"] span')?.textContent?.trim() ?? "";

                    const snippet =
                        el.querySelector('[data-result="snippet"] span')?.textContent?.trim() ?? "";

                    return {
                        title,
                        url,
                        snippet,
                        position: index + 1
                    };
                })
        );

        result.results.push(...(items as SERPResultItem[]));
    } catch (error: any) {
        console.error(`Error fetching ${baseUrl}:`, error.message ?? error);
    }

    return result;
}
