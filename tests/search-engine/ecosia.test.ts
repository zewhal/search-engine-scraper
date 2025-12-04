import { test, expect, describe } from "bun:test";
import type { CuimpHttp } from "cuimp";
import type { SERPQueryParams, SERPResponse } from "../../src/types/serp";
import { ecosia } from "../../src/search-engine/ecosia";

// --- Mock HTML for Ecosia result ---
const mockHtml = `
<article data-test-id="organic-result">
  <h2 data-test-id="result-title">Test Title 1</h2>
  <a data-test-id="result-link" href="https://example.com/1"></a>
  <p data-test-id="web-result-description">Snippet 1</p>
</article>
<article data-test-id="organic-result">
  <h2 data-test-id="result-title">Test Title 2</h2>
  <a data-test-id="result-link" href="https://example.com/2"></a>
  <p data-test-id="web-result-description">Snippet 2</p>
</article>
`;

describe("ecosia()", () => {
  test("parses search results correctly", async () => {
    const mockClient: Partial<CuimpHttp> = {
      get: async (_url: string, _options?: any) => ({
        data: mockHtml
      })
    };

    const queryParams: SERPQueryParams = {
      query: "test query",
      page: 1,
      pageStart: 0
    };

    const headers = {
      "User-Agent": "Bun-Test"
    };

    const proxy = "";

    const result: SERPResponse = await ecosia(
      mockClient as CuimpHttp,
      queryParams,
      headers,
      proxy
    );

    expect(result.engine).toBe("Ecosia");
    expect(result.query).toBe("test query");
    expect(result.page).toBe(1);

    expect(result.results.length).toBe(2);

    expect(result.results[0]).toEqual({
      title: "Test Title 1",
      url: "https://example.com/1",
      snippet: "Snippet 1",
      position: 1
    });

    expect(result.results[1]).toEqual({
      title: "Test Title 2",
      url: "https://example.com/2",
      snippet: "Snippet 2",
      position: 2
    });
  });

  test("returns empty results if client throws", async () => {
    const failingClient: Partial<CuimpHttp> = {
      get: async () => {
        throw new Error("Network error");
      }
    };

    const queryParams: SERPQueryParams = {
      query: "fail test",
      page: 1
    };

    const headers = {};
    const proxy = "";

    const result = await ecosia(
      failingClient as CuimpHttp,
      queryParams,
      headers,
      proxy
    );

    expect(result.engine).toBe("Ecosia");
    expect(result.query).toBe("fail test");
    expect(result.results).toEqual([]);
  });
});
