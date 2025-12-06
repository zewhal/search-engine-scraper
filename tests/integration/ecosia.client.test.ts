import { test, expect, describe } from "bun:test";
import { createCuimpClient } from "../../src/client";
import type { SERPQueryParams, SERPResponse } from "../../src/types/serp";
import { ecosia } from "../../src/search-engine/ecosia";
import type { CuimpResponse } from "cuimp";
import { join } from "path";

describe("ecosia() integration with client (fixture)", () => {
  test("parses HTML fixture correctly", async () => {
    const fixturePath = join(import.meta.dir, "../fixtures/ecosia/ecosia.live.html");
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
    expect(result.results.length).toBe(10);

    expect(result.results[0]).toEqual({
    "title": "Asdasd - song and lyrics by LMBECIL - Spotify",
    "url": "https://open.spotify.com/track/6iF3o1II7W7VaqHMZG3d04",
    "snippet": "Asdasd · Recommended based on this song · Popular Tracks by LMBECIL · Popular Releases by LMBECIL · Popular Singles and EPs by LMBECIL · Recommended releases.",
    "position": 1
    });

    expect(result.results[1]).toEqual({
      "title": "ASDASD : r/spotify - Reddit",
      "url": "https://www.reddit.com/r/spotify/comments/jr00n3/asdasd/",
      "snippet": "Nov 9, 2020 ... I like to sort my songs within a playlist alphabetically, or in custom order. I think it looks better visually if you don't have a bunch of songs from the same ...",
      "position": 2
    });

    client.get = originalGet;
  });
});
