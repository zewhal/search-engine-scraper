import { test, expect, describe } from "bun:test";
import type { SERPQueryParams } from "../../src/types/serp";
import buildUrls  from "../../src/utils/buildUrls";

describe("buildUrls()", () => {
  test("builds multiple urls replacing {query} and {page}", () => {
    const baseUrl =
      "https://www.ecosia.org/search?method=index&q={query}&p={page}";

    const params: SERPQueryParams = {
      query: "top 10 most wanted",
      page: 3,
      pageStart: 0
    };

    const result = buildUrls(baseUrl, params);

    expect(result).toEqual([
      "https://www.ecosia.org/search?method=index&q=top%2010%20most%20wanted&p=0",
      "https://www.ecosia.org/search?method=index&q=top%2010%20most%20wanted&p=1",
      "https://www.ecosia.org/search?method=index&q=top%2010%20most%20wanted&p=2",
    ]);
  });

  test("returns an empty array if page is 0", () => {
    const baseUrl =
      "https://www.ecosia.org/search?method=index&q={query}&p={page}";

    const params: SERPQueryParams = {
      query: "hello world",
      page: 0,
      pageStart: 0
    };

    const result = buildUrls(baseUrl, params);

    expect(result).toEqual([]);
  });

  test("encodes query strings", () => {
    const baseUrl =
      "https://www.ecosia.org/search?method=index&q={query}&p={page}";

    const params: SERPQueryParams = {
      query: "typescript & node.js",
      page: 1,
      pageStart: 0
    };

    const result = buildUrls(baseUrl, params);

    expect(result).toEqual([
      "https://www.ecosia.org/search?method=index&q=typescript%20%26%20node.js&p=0",
    ]);
  });

  test("supports one-based page indexing (pageStart = 1)", () => {
    const baseUrl =
      "https://example.com?q={query}&page={page}";

    const params: SERPQueryParams = {
      query: "bing api",
      page: 3,
      pageStart: 1
    };

    const result = buildUrls(baseUrl, params);

    expect(result).toEqual([
      "https://example.com?q=bing%20api&page=1",
      "https://example.com?q=bing%20api&page=2",
      "https://example.com?q=bing%20api&page=3",
    ]);
  });
});
