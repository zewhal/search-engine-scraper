import { test, expect, describe } from "bun:test";
import { createCuimpClient } from "../../src/client";
import type { SERPQueryParams, SERPResponse } from "../../src/types/serp";
import { ecosia } from "../../src/search-engine/ecosia";
import type { CuimpResponse } from "cuimp";

const mockHtml = `
<article data-test-id="organic-result">
  <h2 data-test-id="result-title">Integration Test Title 1</h2>
  <a data-test-id="result-link" href="https://example.com/1"></a>
  <p data-test-id="web-result-description">Snippet 1</p>
</article>
<article data-test-id="organic-result">
  <h2 data-test-id="result-title">Integration Test Title 2</h2>
  <a data-test-id="result-link" href="https://example.com/2"></a>
  <p data-test-id="web-result-description">Snippet 2</p>
</article>
`;

describe("ecosia() integration with client", () => {
  test("parses search results correctly using Cuimp client", async () => {
    // Create a CuimpHttp client
    const client = createCuimpClient();

    // Mock the 'get' method to return our HTML
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
      query: "integration test",
      page: 1,
      pageStart: 0
    };

    const headers = { "User-Agent": "Bun-Test" };
    const proxy = "";

    const result: SERPResponse = await ecosia(client, queryParams, headers, proxy);

    expect(result.engine).toBe("Ecosia");
    expect(result.query).toBe("integration test");
    expect(result.page).toBe(1);

    expect(result.results.length).toBe(2);

    expect(result.results[0]).toEqual({
      title: "Integration Test Title 1",
      url: "https://example.com/1",
      snippet: "Snippet 1",
      position: 1
    });

    expect(result.results[1]).toEqual({
      title: "Integration Test Title 2",
      url: "https://example.com/2",
      snippet: "Snippet 2",
      position: 2
    });

    // Restore original get method if needed
    client.get = originalGet;
  });
});
