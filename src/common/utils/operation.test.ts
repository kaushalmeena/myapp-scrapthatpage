import { describe, expect, it } from "vitest";
import { LARGE_OPERATIONS } from "../constants/largeOperations";
import { SmallOperation } from "../types/smallOperation";
import {
  convertToLargeOperation,
  convertToSmallOperation,
  isOperationValid,
  replaceFormatWithInputs,
  validateWithRules
} from "./operation";

const openOperation: SmallOperation = {
  type: "open",
  inputs: [{ type: "text", value: "https://example.com" }]
};

const whileOperation: SmallOperation = {
  type: "while",
  inputs: [
    { type: "text", value: "{{i}} < 3" },
    { type: "operation_box", operations: [openOperation] }
  ]
};

describe("replaceFormatWithInputs", () => {
  it("replaces indexed tokens with input values", () => {
    expect(
      replaceFormatWithInputs("{0} [{1}]", [
        { type: "text", value: "name" },
        { type: "text", value: ".selector" }
      ])
    ).toBe("name [.selector]");
  });

  it("renders empty string for operation_box inputs", () => {
    expect(
      replaceFormatWithInputs("{0}", [
        { type: "operation_box", operations: [] }
      ])
    ).toBe("");
  });
});

describe("operation conversion", () => {
  it("round-trips a simple operation", () => {
    const large = convertToLargeOperation(openOperation);
    expect(large.type).toBe("open");
    expect(large.inputs[0].type === "text" && large.inputs[0].value).toBe(
      "https://example.com"
    );
    expect(convertToSmallOperation(large)).toEqual(openOperation);
  });

  it("round-trips nested operations recursively", () => {
    const large = convertToLargeOperation(whileOperation);
    expect(convertToSmallOperation(large)).toEqual(whileOperation);
  });

  it("does not mutate the operation templates", () => {
    convertToLargeOperation(openOperation);
    const template = LARGE_OPERATIONS.find((item) => item.type === "open");
    expect(template?.inputs[0].value).toBe("");
  });
});

describe("isOperationValid", () => {
  it("is valid when no input has an error", () => {
    const operation = convertToLargeOperation(openOperation);
    expect(isOperationValid(operation)).toBe(true);
  });

  it("is invalid when any input has an error", () => {
    const operation = convertToLargeOperation(openOperation);
    if (operation.inputs[0].type === "text") {
      operation.inputs[0].error = "Please enter URL.";
    }
    expect(isOperationValid(operation)).toBe(false);
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
