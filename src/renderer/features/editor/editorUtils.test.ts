import { describe, expect, it } from "vitest";
import { Script } from "@/types/script";
import {
  computeOperationNumbers,
  denormalizeState,
  normalizeScript,
  validateEditorState
} from "./editorUtils";

const script: Script = {
  id: 7,
  favorite: 1,
  name: "Movies",
  description: "Scrape movie titles",
  operations: [
    {
      type: "set",
      inputs: [
        { type: "text", value: "page" },
        { type: "select", value: "number" },
        { type: "text", value: "1" }
      ]
    },
    {
      type: "while",
      inputs: [
        { type: "text", value: "{{page}} < 3" },
        {
          type: "operation_box",
          operations: [
            {
              type: "open",
              inputs: [{ type: "text", value: "https://example.com" }]
            },
            {
              type: "increase",
              inputs: [
                { type: "text", value: "page" },
                { type: "text", value: "1" }
              ]
            }
          ]
        }
      ]
    }
  ]
};

describe("normalizeScript / denormalizeState", () => {
  it("round-trips a nested script through the normalized editor state", () => {
    expect(denormalizeState(normalizeScript(script))).toEqual(script);
  });

  it("normalizes nesting into id lists", () => {
    const state = normalizeScript(script);
    expect(state.rootIds).toHaveLength(2);
    expect(Object.keys(state.operations)).toHaveLength(4);
    const whileOp = state.operations[state.rootIds[1]];
    const box = whileOp.inputs[1];
    expect(box.type === "operation_box" && box.operationIds).toHaveLength(2);
  });

  it("derives variables from set operations", () => {
    const state = normalizeScript(script);
    expect(state.variables).toEqual([
      { ownerId: state.rootIds[0], name: "page", type: "number" }
    ]);
  });
});

describe("computeOperationNumbers", () => {
  it("numbers operations in tree order", () => {
    const state = normalizeScript(script);
    const numbers = computeOperationNumbers(state);
    const whileOp = state.operations[state.rootIds[1]];
    const box = whileOp.inputs[1];
    const childIds = box.type === "operation_box" ? box.operationIds : [];

    expect(numbers[state.rootIds[0]]).toBe("1");
    expect(numbers[state.rootIds[1]]).toBe("2");
    expect(numbers[childIds[0]]).toBe("2.1");
    expect(numbers[childIds[1]]).toBe("2.2");
  });
});

describe("validateEditorState", () => {
  it("returns errors for missing required fields, numbered by position", () => {
    const state = normalizeScript({
      favorite: 0,
      name: "",
      description: "",
      operations: [
        { type: "open", inputs: [{ type: "text", value: "" }] },
        {
          type: "if",
          inputs: [
            { type: "text", value: "1 == 1" },
            {
              type: "operation_box",
              operations: [
                { type: "click", inputs: [{ type: "text", value: "" }] }
              ]
            }
          ]
        }
      ]
    });

    const { errors, validatedState } = validateEditorState(state);
    expect(errors).toContain("Please enter name.");
    expect(errors).toContain("Please fix error in operation 1");
    expect(errors).toContain("Please fix error in operation 2.1");
    expect(validatedState.information.name.error).not.toBe("");
    const firstOp = validatedState.operations[validatedState.rootIds[0]];
    expect(
      firstOp.inputs[0].type === "text" && firstOp.inputs[0].error
    ).not.toBe("");
  });

  it("returns no errors for a valid state", () => {
    const { errors } = validateEditorState(normalizeScript(script));
    expect(errors).toEqual([]);
  });
});
