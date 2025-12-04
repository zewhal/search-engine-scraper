import { describe, it, expect } from "bun:test";
import { createClient } from "../src/client";

describe("Cuimp client creation (unit tests)", () => {

    it("should create a client with default descriptor", () => {
        const client = createClient();
        expect(client).toBeDefined();
        expect(typeof client.request).toBe("function");
        expect(typeof client.get).toBe("function");
        expect(typeof client.post).toBe("function");
    });

    it("should create a client with custom descriptor", () => {
        const descriptor = { browser: "firefox", version: "115", platform: "win32" };
        const client = createClient(descriptor);

        expect(client).toBeDefined();
        expect(typeof client.request).toBe("function");
        expect(typeof client.get).toBe("function");
        expect(typeof client.post).toBe("function");
    });

});
