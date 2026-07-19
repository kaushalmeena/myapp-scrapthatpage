import type { OperationType } from "../types/operation";
import type {
  BlockInputSchema,
  OperationSchema,
  SelectInputSchema,
  SelectOption,
  TextInputSchema
} from "../types/operationSchema";
import type { ValidationRule } from "../types/validation";

// Builders keep the catalog terse: only fields that differ from the defaults
// (full width, empty default value, no rules) need to be spelled out.
const required = (message: string): ValidationRule => ({
  type: "required",
  message
});

const text = (
  label: string,
  opts: Partial<Omit<TextInputSchema, "type" | "label">> = {}
): TextInputSchema => ({
  type: "text",
  label,
  width: 12,
  defaultValue: "",
  rules: [],
  ...opts
});

const select = (
  label: string,
  options: SelectOption[],
  opts: Partial<Omit<SelectInputSchema, "type" | "label" | "options">> = {}
): SelectInputSchema => ({
  type: "select",
  label,
  width: 12,
  defaultValue: "",
  options,
  rules: [],
  ...opts
});

const block = (label: string): BlockInputSchema => ({ type: "block", label });

/**
 * The single source of truth for each operation's editor-facing metadata,
 * keyed by type. The stored Operation carries only values; everything here
 * (labels, layout, validation, picker config) is derived from the type.
 */
export const OPERATION_SCHEMA: Record<OperationType, OperationSchema> = {
  open: {
    name: "Open page",
    description: "Go to a URL in the scraper window.",
    format: "{0}",
    inputs: [
      text("URL", {
        variablePicker: { type: "any", mode: "append" },
        rules: [
          required("Please enter URL."),
          { type: "url", message: "Please enter valid URL." }
        ]
      })
    ]
  },
  extract: {
    name: "Extract data",
    description:
      "Collect text or attribute values from every element matching a selector.",
    format: "{0} [{1}]",
    inputs: [
      text("Name", { width: 4, rules: [required("Please enter name.")] }),
      text("Selector", {
        width: 4,
        elementPicker: true,
        variablePicker: { type: "any", mode: "append" },
        rules: [required("Please enter selector.")]
      }),
      select(
        "Attribute",
        [
          { label: "Text content", value: "textContent" },
          { label: "Link URL (href)", value: "href" }
        ],
        {
          width: 4,
          defaultValue: "textContent",
          rules: [required("Please select type.")]
        }
      )
    ]
  },
  click: {
    name: "Click element",
    description: "Click the first element matching a selector.",
    format: "[{0}]",
    inputs: [
      text("Selector", {
        elementPicker: true,
        variablePicker: { type: "any", mode: "append" },
        rules: [required("Please enter selector.")]
      })
    ]
  },
  type: {
    name: "Type text",
    description: "Type text into an input or editable field.",
    format: "[{0}] {1}",
    inputs: [
      text("Selector", {
        width: 6,
        elementPicker: true,
        variablePicker: { type: "any", mode: "append" },
        rules: [required("Please enter selector.")]
      }),
      text("Text", { width: 6, rules: [required("Please enter text.")] })
    ]
  },
  set: {
    name: "Set variable",
    description: "Store a value in a variable for later steps.",
    format: "{0} [{1}]",
    inputs: [
      text("Variable", {
        width: 4,
        variablePicker: { type: "any", mode: "set" },
        variableSetter: { mode: "name" },
        rules: [required("Please enter variable.")]
      }),
      select(
        "Type",
        [
          { label: "Number", value: "number" },
          { label: "String", value: "string" }
        ],
        {
          width: 4,
          defaultValue: "number",
          variableSetter: { mode: "type" },
          rules: [required("Please select type.")]
        }
      ),
      text("Value", { width: 4, rules: [required("Please enter value.")] })
    ]
  },
  increase: {
    name: "Increase variable",
    description: "Add an amount to a number variable.",
    format: "{0} [+{1}]",
    inputs: [
      text("Number Variable", {
        width: 6,
        variablePicker: { type: "number", mode: "set" },
        inputProps: {
          readOnly: true,
          placeholder: "Select number variable from picker"
        },
        rules: [required("Please enter number variable.")]
      }),
      text("Amount", {
        width: 6,
        defaultValue: "1",
        inputProps: { type: "number" },
        rules: [required("Please enter amount.")]
      })
    ]
  },
  decrease: {
    name: "Decrease variable",
    description: "Subtract an amount from a number variable.",
    format: "{0} [-{1}]",
    inputs: [
      text("Number Variable", {
        width: 6,
        defaultValue: "1",
        variablePicker: { type: "number", mode: "set" },
        inputProps: {
          readOnly: true,
          placeholder: "Select number variable from picker"
        },
        rules: [required("Please enter number variable.")]
      }),
      text("Amount", {
        width: 6,
        inputProps: { type: "number" },
        rules: [required("Please enter amount.")]
      })
    ]
  },
  if: {
    name: "If condition",
    description: "Run the nested steps only when the condition is true.",
    format: "{0}",
    inputs: [
      text("Condition", {
        variablePicker: { type: "any", mode: "append" },
        rules: [required("Please enter condition.")]
      }),
      block("If Block")
    ]
  },
  while: {
    name: "While loop",
    description: "Repeat the nested steps while the condition stays true.",
    format: "{0}",
    inputs: [
      text("Condition", {
        variablePicker: { type: "any", mode: "append" },
        rules: [required("Please enter condition.")]
      }),
      block("While Block")
    ]
  },
  wait: {
    name: "Wait for element",
    description: "Pause until an element appears on the page.",
    format: "[{0}] {1}ms",
    inputs: [
      text("Selector", {
        width: 6,
        elementPicker: true,
        variablePicker: { type: "any", mode: "append" },
        rules: [required("Please enter selector.")]
      }),
      text("Timeout (ms)", {
        width: 6,
        defaultValue: "10000",
        inputProps: { type: "number" },
        rules: [required("Please enter timeout.")]
      })
    ]
  },
  delay: {
    name: "Delay",
    description: "Pause for a fixed number of milliseconds.",
    format: "{0}ms",
    inputs: [
      text("Duration (ms)", {
        defaultValue: "1000",
        inputProps: { type: "number" },
        rules: [required("Please enter duration.")]
      })
    ]
  },
  scroll: {
    name: "Scroll",
    description:
      "Scroll to an element, or to the page bottom to load lazy content.",
    format: "[{0}]",
    inputs: [
      text("Selector (leave empty for page bottom)", {
        elementPicker: true,
        variablePicker: { type: "any", mode: "append" }
      })
    ]
  }
};

// Catalog order for the step picker (insertion order of OPERATION_SCHEMA).
export const OPERATION_TYPES = Object.keys(OPERATION_SCHEMA) as OperationType[];
