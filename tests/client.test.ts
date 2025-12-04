import { describe, it, expect, test } from "bun:test";
import { createCuimpClient, createPatchrightClient } from "../src/client";

describe("Cuimp client creation (unit tests)", () => {

    it("should create a client with default descriptor", () => {
        const client = createCuimpClient();
        expect(client).toBeDefined();
        expect(typeof client.request).toBe("function");
        expect(typeof client.get).toBe("function");
        expect(typeof client.post).toBe("function");
    });

    it("should create a client with custom descriptor", () => {
        const descriptor = { browser: "firefox", version: "115", platform: "win32" };
        const client = createCuimpClient(descriptor);

        expect(client).toBeDefined();
        expect(typeof client.request).toBe("function");
        expect(typeof client.get).toBe("function");
        expect(typeof client.post).toBe("function");
    });

});


describe("createPatchrightClient() unit tests", () => {
  test("returns a browser and a page object with expected methods", async () => {
    const { browser, page } = await createPatchrightClient({ headless: true });

    expect(browser).toBeTruthy();
    expect(page).toBeTruthy();

    expect(typeof page.goto).toBe("function");
    expect(typeof page.$).toBe("function");
    expect(typeof page.$$eval).toBe("function");

    await browser.close();
  });
});
