import { test, expect, describe } from "bun:test";
import type { CuimpHttp, CuimpResponse } from "cuimp";
import type { SERPQueryParams, SERPResponse } from "../../src/types/serp";
import { brave } from "../../src/search-engine/brave";
import { join } from "node:path";


describe("brave() unit", () => {
  test("parses search results correctly using fixture", async () => {
      const fixturePath = join(import.meta.dir, "../fixtures/brave/brave.live.html");
      const mockHtml = await Bun.file(fixturePath).text();
      const mockClient: Partial<CuimpHttp> = {
        get: async <T = any>(_url: string, _options?: any): Promise<CuimpResponse<T>> => {
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
        }
      };

    const queryParams: SERPQueryParams = {
      query: "entrance to agartha pdf site:gov.ph",
      page: 1,
      pageStart: 0
    };

    const headers = { "User-Agent": "Bun-Test" };
    const proxy = "";

    const result: SERPResponse = await brave(
      mockClient as CuimpHttp,
      queryParams,
      headers,
      proxy
    );

    expect(result.engine).toBe("brave");
    expect(result.query).toBe("entrance to agartha pdf site:gov.ph");
    expect(result.page).toBe(1);
    expect(result.results.length).toBeGreaterThan(0);
  });

  test("returns empty results if client throws", async () => {
    const failingClient: Partial<CuimpHttp> = {
      get: async () => {
        throw new Error("Network error");
      }
    };

    const queryParams: SERPQueryParams = {
      query: "fail test",
      page: 1,
      pageStart: 0
    };

    const headers = {};
    const proxy = "";

    const result: SERPResponse = await brave(
      failingClient as CuimpHttp,
      queryParams,
      headers,
      proxy
    );

    expect(result.engine).toBe("brave");
    expect(result.query).toBe("fail test");
    expect(result.results).toEqual([]);
  });
});
