import { test, expect, describe } from "bun:test";
import { createCuimpClient } from "../../src/client";
import type { SERPQueryParams, SERPResponse } from "../../src/types/serp";
import { scrapeEngine } from "../../src/utils/scraper";
import type { CuimpResponse } from "cuimp";
import { join } from "path";

describe("scrapeEngine() integration with Agartha fixture", () => {
  test("parses HTML fixture correctly", async () => {
    const fixturePath = join(import.meta.dir, "../fixtures/utils/scraper.mock.html");
    const mockHtml = await Bun.file(fixturePath).text();

    const client = createCuimpClient();

    const originalGet = client.get.bind(client);
    client.get = async <T = any>(_url: string, _options?: any): Promise<CuimpResponse<T>> => {
      return {
        data: mockHtml as unknown as T,
        status: 200,
        statusText: "OK",
        headers: {},
        rawBody: Buffer.from(""),
        request: {
          url: _url,
          method: "GET",
          headers: {},
          command: "GET"
        }
      };
    };

    const queryParams: SERPQueryParams = {
      query: "agartha secret",
      page: 1,
      pageStart: 0
    };

    const headers = { "User-Agent": "Bun-Test" };
    const proxy = "";

    const result: SERPResponse = await scrapeEngine(
      client,
      queryParams,
      {
        engine: "agartha",
        baseUrl: "https://mock.agartha/search?q={query}&p={page}",
        resultSelector: "div.snippet.svelte-jmfu5f:not(.standalone)",
        parseItem: ($el) => ({
          title: $el.find("div.title.search-snippet-title.line-clamp-1.svelte-14r20fy").text().trim(),
          url: $el.find("a.svelte-14r20fy.l1").attr("href")!,
          snippet: $el.find("div.generic-snippet.svelte-1cwdgg3").text().trim(),
        }),
      },
      headers,
      proxy
    );

    expect(result.engine).toBe("agartha");
    expect(result.query).toBe("agartha secret");
    expect(result.page).toBe(1);
    expect(result.results.length).toBe(5);

    expect(result.results[0]).toEqual({
      title: "Agartha Portal Coordinates",
      url: "https://mythical.agartha.gov/portal1.pdf",
      snippet: "Coordinates to the first portal of Agartha, hidden in the Amazon rainforest. Fictional for testing.",
      position: 1
    });

    expect(result.results[1]).toEqual({
      title: "Subterranean Flora of Agartha",
      url: "https://mythical.agartha.gov/flora.pdf",
      snippet: "Detailed descriptions of imaginary underground plants and their mystical properties.",
      position: 2
    });

    client.get = originalGet;
  });
});
