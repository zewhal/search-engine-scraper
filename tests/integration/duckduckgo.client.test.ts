import { test, expect, describe } from "bun:test";
import { duckduckgo } from "../../src/search-engine/duckduckgo";
import { createPatchrightClient } from "../../src/client";
import type { SERPQueryParams, SERPResponse } from "../../src/types/serp";

describe("duckduckgo() real integration test", () => {
  test("scrapes DuckDuckGo search results using Patchright", async () => {
    const { page, browser } = await createPatchrightClient({ headless: false });

    try {
      const queryParams: SERPQueryParams = {
        query: "bun test framework",
        page: 1
      };

      const result: SERPResponse = await duckduckgo(page, queryParams);

      expect(result.engine).toBe("duckduckgo");
      expect(result.query).toBe("bun test framework");
      expect(result.page).toBe(1);
      expect(result.results.length).toBeGreaterThan(0);

      const first = result.results[0];
      expect(first).toHaveProperty("title");
      expect(first).toHaveProperty("url");
      expect(first).toHaveProperty("snippet");
      expect(first).toHaveProperty("position");
    } finally {

      await browser.close();
    }
  }, { timeout: 60_000 });
});
