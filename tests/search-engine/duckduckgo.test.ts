import { describe, it, expect, vi } from "bun:test";
import type { Page } from "patchright";
import { duckduckgo } from "../../src/search-engine/duckduckgo"; // adjust path
import type { SERPQueryParams, SERPResponse } from "../../src/types/serp";

describe("duckduckgo()", () => {

    it("should call page.goto and wait for selector for each URL", async () => {

        const page = {
            goto: vi.fn().mockResolvedValue(undefined),
            waitForSelector: vi.fn().mockResolvedValue(undefined),
        } as unknown as Page;

        const queryParams: SERPQueryParams = {
            query: "test-query",
            page: 1,
            pageStart: 1
        };

        const result: SERPResponse = await duckduckgo(page, queryParams);

        expect(page.goto).toHaveBeenCalled();
        expect(page.waitForSelector).toHaveBeenCalledWith('article[data-testid="result"]');

        expect(result.engine).toBe("duckduckgo");
        expect(result.query).toBe("test-query");
        expect(result.page).toBe(1);
        expect(Array.isArray(result.results)).toBe(true);
    });

});
