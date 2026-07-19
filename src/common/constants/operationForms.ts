import type { FormOperation } from "../types/formOperation";

export const OPERATION_FORMS: FormOperation[] = [
  {
    name: "Open page",
    type: "open",
    description: "Go to a URL in the scraper window.",
    format: "{0}",
    inputs: [
      {
        label: "URL",
        type: "text",
        width: 12,
        value: "",
        error: "",
        variablePicker: {
          type: "any",
          mode: "append"
        },
        rules: [
          {
            type: "required",
            message: "Please enter URL."
          },
          {
            type: "url",
            message: "Please enter valid URL."
          }
        ]
      }
    ]
  },
  {
    name: "Extract data",
    type: "extract",
    description:
      "Collect text or attribute values from every element matching a selector.",
    format: "{0} [{1}]",
    inputs: [
      {
        label: "Name",
        type: "text",
        width: 4,
        value: "",
        error: "",
        rules: [
          {
            type: "required",
            message: "Please enter name."
          }
        ]
      },
      {
        label: "Selector",
        type: "text",
        elementPicker: true,
        width: 4,
        value: "",
        error: "",
        variablePicker: {
          type: "any",
          mode: "append"
        },
        rules: [
          {
            type: "required",
            message: "Please enter selector."
          }
        ]
      },
      {
        label: "Attribute",
        type: "select",
        width: 4,
        value: "textContent",
        error: "",
        options: [
          {
            label: "Text content",
            value: "textContent"
          },
          {
            label: "Link URL (href)",
            value: "href"
          }
        ],
        rules: [
          {
            type: "required",
            message: "Please select type."
          }
        ]
      }
    ]
  },
  {
    name: "Click element",
    type: "click",
    description: "Click the first element matching a selector.",
    format: "[{0}]",
    inputs: [
      {
        label: "Selector",
        type: "text",
        elementPicker: true,
        width: 12,
        value: "",
        error: "",
        variablePicker: {
          type: "any",
          mode: "append"
        },
        rules: [
          {
            type: "required",
            message: "Please enter selector."
          }
        ]
      }
    ]
  },
  {
    name: "Type text",
    type: "type",
    description: "Type text into an input or editable field.",
    format: "[{0}] {1}",
    inputs: [
      {
        label: "Selector",
        type: "text",
        elementPicker: true,
        width: 6,
        value: "",
        error: "",
        variablePicker: {
          type: "any",
          mode: "append"
        },
        rules: [
          {
            type: "required",
            message: "Please enter selector."
          }
        ]
      },
      {
        label: "Text",
        type: "text",
        width: 6,
        value: "",
        error: "",
        rules: [
          {
            type: "required",
            message: "Please enter text."
          }
        ]
      }
    ]
  },
  {
    name: "Set variable",
    type: "set",
    description: "Store a value in a variable for later steps.",
    format: "{0} [{1}]",
    inputs: [
      {
        label: "Variable",
        type: "text",
        width: 4,
        value: "",
        error: "",
        variablePicker: {
          type: "any",
          mode: "set"
        },
        variableSetter: {
          mode: "name"
        },
        rules: [
          {
            type: "required",
            message: "Please enter variable."
          }
        ]
      },
      {
        label: "Type",
        type: "select",
        width: 4,
        value: "number",
        error: "",
        variableSetter: {
          mode: "type"
        },
        options: [
          {
            label: "Number",
            value: "number"
          },
          {
            label: "String",
            value: "string"
          }
        ],
        rules: [
          {
            type: "required",
            message: "Please select type."
          }
        ]
      },
      {
        label: "Value",
        type: "text",
        width: 4,
        value: "",
        error: "",
        rules: [
          {
            type: "required",
            message: "Please enter value."
          }
        ]
      }
    ]
  },
  {
    name: "Increase variable",
    type: "increase",
    description: "Add an amount to a number variable.",
    format: "{0} [+{1}]",
    inputs: [
      {
        label: "Number Variable",
        type: "text",
        width: 6,
        value: "",
        error: "",
        variablePicker: {
          type: "number",
          mode: "set"
        },
        inputProps: {
          readOnly: true,
          placeholder: "Select number variable from picker"
        },
        rules: [
          {
            type: "required",
            message: "Please enter number variable."
          }
        ]
      },
      {
        label: "Amount",
        type: "text",
        width: 6,
        value: "1",
        error: "",
        inputProps: {
          type: "number"
        },
        rules: [
          {
            type: "required",
            message: "Please enter amount."
          }
        ]
      }
    ]
  },
  {
    name: "Decrease variable",
    type: "decrease",
    description: "Subtract an amount from a number variable.",
    format: "{0} [-{1}]",
    inputs: [
      {
        label: "Number Variable",
        type: "text",
        width: 6,
        value: "1",
        error: "",
        variablePicker: {
          type: "number",
          mode: "set"
        },
        inputProps: {
          readOnly: true,
          placeholder: "Select number variable from picker"
        },
        rules: [
          {
            type: "required",
            message: "Please enter number variable."
          }
        ]
      },
      {
        label: "Amount",
        type: "text",
        width: 6,
        value: "",
        error: "",
        inputProps: {
          type: "number"
        },
        rules: [
          {
            type: "required",
            message: "Please enter amount."
          }
        ]
      }
    ]
  },
  {
    name: "If condition",
    type: "if",
    description: "Run the nested steps only when the condition is true.",
    format: "{0}",
    inputs: [
      {
        label: "Condition",
        type: "text",
        width: 12,
        value: "",
        error: "",
        variablePicker: {
          type: "any",
          mode: "append"
        },
        rules: [
          {
            type: "required",
            message: "Please enter condition."
          }
        ]
      },
      {
        label: "If Block",
        type: "operation_box",
        operations: []
      }
    ]
  },
  {
    name: "While loop",
    type: "while",
    description: "Repeat the nested steps while the condition stays true.",
    format: "{0}",
    inputs: [
      {
        label: "Condition",
        type: "text",
        width: 12,
        value: "",
        error: "",
        variablePicker: {
          type: "any",
          mode: "append"
        },
        rules: [
          {
            type: "required",
            message: "Please enter condition."
          }
        ]
      },
      {
        label: "While Block",
        type: "operation_box",
        operations: []
      }
    ]
  },
  {
    name: "Wait for element",
    type: "wait",
    description: "Pause until an element appears on the page.",
    format: "[{0}] {1}ms",
    inputs: [
      {
        label: "Selector",
        type: "text",
        elementPicker: true,
        width: 6,
        value: "",
        error: "",
        variablePicker: {
          type: "any",
          mode: "append"
        },
        rules: [
          {
            type: "required",
            message: "Please enter selector."
          }
        ]
      },
      {
        label: "Timeout (ms)",
        type: "text",
        width: 6,
        value: "10000",
        error: "",
        inputProps: {
          type: "number"
        },
        rules: [
          {
            type: "required",
            message: "Please enter timeout."
          }
        ]
      }
    ]
  },
  {
    name: "Delay",
    type: "delay",
    description: "Pause for a fixed number of milliseconds.",
    format: "{0}ms",
    inputs: [
      {
        label: "Duration (ms)",
        type: "text",
        width: 12,
        value: "1000",
        error: "",
        inputProps: {
          type: "number"
        },
        rules: [
          {
            type: "required",
            message: "Please enter duration."
          }
        ]
      }
    ]
  },
  {
    name: "Scroll",
    type: "scroll",
    description:
      "Scroll to an element, or to the page bottom to load lazy content.",
    format: "[{0}]",
    inputs: [
      {
        label: "Selector (leave empty for page bottom)",
        type: "text",
        elementPicker: true,
        width: 12,
        value: "",
        error: "",
        variablePicker: {
          type: "any",
          mode: "append"
        },
        rules: []
      }
    ]
  }
];
