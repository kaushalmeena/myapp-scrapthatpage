import { describe, expect, it } from "vitest";
import type { Script } from "@/types/script";
import {
  parseStoredScript,
  prepareScriptForWrite,
  SCRIPT_SCHEMA_VERSION
} from "./schema";

const validScript: Script = {
  favorite: false,
  name: "Test",
  description: "A script",
  operations: [
    { type: "open", inputs: [{ type: "text", value: "https://example.com" }] }
  ]
};

describe("prepareScriptForWrite", () => {
  it("stamps the current schema version", () => {
    expect(prepareScriptForWrite(validScript).version).toBe(
      SCRIPT_SCHEMA_VERSION
    );
  });

  it("throws on invalid scripts so bugs surface at the write site", () => {
    expect(() => prepareScriptForWrite({ ...validScript, name: "" })).toThrow();
  });
});

describe("parseStoredScript", () => {
  it("accepts a valid stored record", () => {
    expect(parseStoredScript({ ...validScript, id: 1, version: 1 })).toEqual({
      ...validScript,
      id: 1,
      version: 1
    });
  });

  it("returns null for corrupt records instead of throwing", () => {
    expect(parseStoredScript({ favorite: 2, name: 1 })).toBeNull();
    expect(
      parseStoredScript({
        ...validScript,
        operations: [{ type: "open", inputs: [] }]
      })
    ).toBeNull();
  });
});
