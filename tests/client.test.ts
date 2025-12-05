import { describe, it, expect, test } from "bun:test";
import { createCuimpClient } from "../src/client";

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