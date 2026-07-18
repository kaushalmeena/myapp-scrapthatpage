import { describe, expect, it } from "vitest";
import { Script } from "@/types/script";
import {
  getOperationNumber,
  getScriptEditorStateFromScript,
  getScriptFromScriptEditorState,
  validateScriptEditorState
} from "./editorUtils";

const script: Script = {
  id: 7,
  favorite: 1,
  name: "Movies",
  description: "Scrape movie titles",
  operations: [
    { type: "open", inputs: [{ type: "text", value: "https://example.com" }] }
  ]
};

describe("getOperationNumber", () => {
  it("numbers top-level operations from 1", () => {
    expect(getOperationNumber("operations.0")).toBe("1");
    expect(getOperationNumber("operations.4")).toBe("5");
  });

  it("numbers nested operations with dotted segments", () => {
    expect(getOperationNumber("operations.1.inputs.1.operations.2")).toBe(
      "2.3"
    );
  });
});

describe("script <-> editor state conversion", () => {
  it("round-trips a script through the editor state", () => {
    const state = getScriptEditorStateFromScript(script);
    expect(state.information.name.value).toBe("Movies");
    expect(getScriptFromScriptEditorState(state)).toEqual(script);
  });
});

describe("validateScriptEditorState", () => {
  it("returns errors for missing required fields", () => {
    const state = getScriptEditorStateFromScript({
      favorite: 0,
      name: "",
      description: "",
      operations: [{ type: "open", inputs: [{ type: "text", value: "" }] }]
    });
    const { errors, validatedState } = validateScriptEditorState(state);
    expect(errors.length).toBeGreaterThanOrEqual(3);
    expect(validatedState.information.name.error).not.toBe("");
    const input = validatedState.operations[0].inputs[0];
    expect(input.type === "text" && input.error).not.toBe("");
  });

  it("returns no errors for a valid state", () => {
    const state = getScriptEditorStateFromScript(script);
    const { errors } = validateScriptEditorState(state);
    expect(errors).toEqual([]);
  });
});
