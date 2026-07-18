import { VALIDATION_FUNCTION } from "../constants/validation";
import { ValidationRule } from "../types/validation";

// Builds an operation's human-readable subheader from its `format` string by
// substituting single-brace, index-based tokens (e.g. "Open {0}") with the
// corresponding input's value. Distinct from the runtime `{{name}}` variable
// tokens resolved in the ScriptRunner. Structurally typed so stored (Small),
// template (Large) and editor input shapes all work.
export const replaceFormatWithInputs = (
  format: string,
  inputs: ReadonlyArray<unknown>
) =>
  format.replace(/{[\w-]+}/g, (match: string) => {
    const index = Number.parseInt(match.slice(1, -1), 10);
    const value = (inputs[index] as { value?: unknown } | undefined)?.value;
    if (typeof value === "string") {
      return value || "undefined";
    }
    return "";
  });

// An operation is valid when none of its value-carrying inputs hold a
// validation error (operation_box inputs have no error field and are skipped).
export const isOperationValid = (operation: {
  inputs: ReadonlyArray<unknown>;
}) =>
  operation.inputs.every(
    (input) => !(input as { error?: unknown } | undefined)?.error
  );

export const validateWithRules = (value: string, rules: ValidationRule[]) => {
  for (let i = 0; i < rules.length; i += 1) {
    const validate = VALIDATION_FUNCTION[rules[i].type];
    if (validate && !validate(value)) {
      return rules[i].message;
    }
  }
  return "";
};
