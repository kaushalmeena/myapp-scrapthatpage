import { describe, expect, it } from "vitest";
import {
  isOperationValid,
  replaceFormatWithInputs,
  validateWithRules
} from "./operation";

describe("replaceFormatWithInputs", () => {
  it("replaces indexed tokens with input values", () => {
    expect(
      replaceFormatWithInputs("{0} [{1}]", [
        { value: "name" },
        { value: ".selector" }
      ])
    ).toBe("name [.selector]");
  });

  it("renders empty string for inputs without a value (operation boxes)", () => {
    expect(
      replaceFormatWithInputs("{0}", [{ operationIds: [] as string[] }])
    ).toBe("");
  });

  it("renders an ellipsis placeholder for empty values", () => {
    expect(replaceFormatWithInputs("{0}", [{ value: "" }])).toBe("…");
  });
});

describe("isOperationValid", () => {
  it("is valid when no input has an error", () => {
    expect(
      isOperationValid({ inputs: [{ error: "" }, { error: undefined }, {}] })
    ).toBe(true);
  });

  it("is invalid when any input has an error", () => {
    expect(
      isOperationValid({ inputs: [{ error: "" }, { error: "Required." }] })
    ).toBe(false);
  });
});

describe("validateWithRules", () => {
  const rules = [
    { type: "required" as const, message: "Required." },
    { type: "url" as const, message: "Invalid URL." }
  ];

  it("returns the first failing rule's message", () => {
    expect(validateWithRules("", rules)).toBe("Required.");
    expect(validateWithRules("not-a-url", rules)).toBe("Invalid URL.");
  });

  it("returns empty string when all rules pass", () => {
    expect(validateWithRules("https://example.com", rules)).toBe("");
  });
});
