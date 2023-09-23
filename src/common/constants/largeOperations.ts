import { LargeOperation } from "../types/largeOperation";

export const LARGE_OPERATIONS: LargeOperation[] = [
  {
    name: "OPEN",
    type: "open",
    description: "Open url for web scrapping.",
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
    name: "Extract",
    type: "extract",
    description: "Scraps specified elements from opened page.",
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
            label: "Text",
            value: "textContent"
          },
          {
            label: "Href",
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
    name: "CLICK",
    type: "click",
    description: "Click on specified element.",
    format: "[{0}]",
    inputs: [
      {
        label: "Selector",
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
            message: "Please enter selector."
          }
        ]
      }
    ]
  },
  {
    name: "TYPE",
    type: "type",
    description: "Type text into specified input.",
    format: "[{0}] {1}",
    inputs: [
      {
        label: "Selector",
        type: "text",
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
    name: "SET",
    type: "set",
    description: "Set specified data to a variable.",
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
    name: "INCREASE",
    type: "increase",
    description: "Increase specified variable",
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
    name: "DECREASE",
    type: "decrease",
    description: "Decrease specified variable",
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
    name: "IF",
    type: "if",
    description: "Executes block only if specified condition is true.",
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
    name: "WHILE",
    type: "while",
    description: "Executes block until specified condition become false.",
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
  }
];
