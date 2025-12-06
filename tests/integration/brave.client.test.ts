import { test, expect, describe } from "bun:test";
import { createCuimpClient } from "../../src/client";
import type { SERPQueryParams, SERPResponse } from "../../src/types/serp";
import { brave } from "../../src/search-engine/brave";
import type { CuimpResponse } from "cuimp";
import { join } from "path";

describe("brave() integration with client (fixture)", () => {
  test("parses HTML fixture correctly", async () => {
    const fixturePath = join(import.meta.dir, "../fixtures/brave/brave.live.html");
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
      query: "entrance to agartha pdf site:gov.ph",
      page: 1,
      pageStart: 0
    };

    const headers = { "User-Agent": "Bun-Test" };
    const proxy = "";

    const result: SERPResponse = await brave(client, queryParams, headers, proxy);

    expect(result.engine).toBe("brave");
    expect(result.query).toBe("entrance to agartha pdf site:gov.ph");
    expect(result.page).toBe(1);

    expect(result.results[0]).toEqual({
    "title": "Agartha Tome 1",
    "url": "https://webdisk.dictm.pnp.gov.ph/browse/p327G2/4265878/agartha_tome_1.pdf",
    "snippet": "July 24, 2025 - The burgeoning interest in subterranean infrastructure presents a fascinating opportunity for innovation and strategic planning. \"Agartha Tome 1,\" a hypothetical compendium on this subject, if it truly existed, would be a significant resource, bridging the gap between theoretical concepts and practical applications.",
    "position": 1
    });

    client.get = originalGet;
  });
});
