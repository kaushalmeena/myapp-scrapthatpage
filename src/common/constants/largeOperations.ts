import { LargeOperation } from "../types/largeOperation";
import { INPUT_TYPES } from "./input";
import { OPERATION_TYPES } from "./operation";
import { VALIDATION_TYPES } from "./validation";

export const LARGE_OPERTAIONS: LargeOperation[] = [
  {
    name: "OPEN",
    type: OPERATION_TYPES.OPEN,
    description: "Open url for web scrapping.",
    format: "{0}",
    inputs: [
      {
        label: "URL",
        type: INPUT_TYPES.TEXT,
        width: 1,
        value: "",
        error: "",
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please enter URL."
          },
          {
            type: VALIDATION_TYPES.URL,
            message: "Please enter valid URL."
          }
        ]
      }
    ]
  },
  {
    name: "Extract",
    type: OPERATION_TYPES.EXTRACT,
    description: "Scraps specified elements from opened page.",
    format: "{0} [{1}]",
    inputs: [
      {
        label: "Name",
        type: INPUT_TYPES.TEXT,
        width: 0.5,
        value: "",
        error: "",
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please enter name."
          }
        ]
      },
      {
        label: "CSS selector",
        type: INPUT_TYPES.TEXT,
        width: 0.5,
        value: "",
        error: "",
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please enter selector."
          }
        ]
      }
    ]
  },
  {
    name: "CLICK",
    type: OPERATION_TYPES.CLICK,
    description: "Click on specified element.",
    format: "[{0}]",
    inputs: [
      {
        label: "CSS selector",
        type: INPUT_TYPES.TEXT,
        width: 0.5,
        value: "",
        error: "",
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please enter selector."
          }
        ]
      }
    ]
  },
  {
    name: "TYPE",
    type: OPERATION_TYPES.TYPE,
    description: "Type text into specified input.",
    format: "[{0}] {1}",
    inputs: [
      {
        label: "CSS selector",
        type: INPUT_TYPES.TEXT,
        width: 0.5,
        value: "",
        error: "",
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please enter selector."
          }
        ]
      },
      {
        label: "Text",
        type: INPUT_TYPES.TEXT,
        width: 0.5,
        value: "",
        error: "",
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please enter text."
          }
        ]
      }
    ]
  },
  {
    name: "SET",
    type: OPERATION_TYPES.SET,
    description: "Set specified data to a variable.",
    format: "{0} [{1}]",
    inputs: [
      {
        label: "Variable",
        type: INPUT_TYPES.TEXT,
        width: 0.5,
        value: "",
        error: "",
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please enter Variable."
          }
        ]
      },
      {
        label: "Value",
        type: INPUT_TYPES.TEXT,
        width: 0.5,
        value: "",
        error: "",
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please enter value."
          }
        ]
      }
    ]
  },
  {
    name: "INCREASE",
    type: OPERATION_TYPES.INCREASE,
    description: "Increase specified variable",
    format: "{0} [+{1}]",
    inputs: [
      {
        label: "Variable",
        type: INPUT_TYPES.TEXT,
        width: 0.5,
        value: "",
        error: "",
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please enter Variable."
          }
        ]
      },
      {
        label: "Amount",
        type: INPUT_TYPES.TEXT,
        width: 0.5,
        value: "",
        error: "",
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please enter amount."
          }
        ]
      }
    ]
  },
  {
    name: "DECREASE",
    type: OPERATION_TYPES.DECREASE,
    description: "Decrease specified variable",
    format: "{0} [-{1}]",
    inputs: [
      {
        label: "Variable",
        type: INPUT_TYPES.TEXT,
        width: 0.5,
        value: "",
        error: "",
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please enter Variable."
          }
        ]
      },
      {
        label: "Amount",
        type: INPUT_TYPES.TEXT,
        width: 0.5,
        value: "",
        error: "",
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please enter amount."
          }
        ]
      }
    ]
  },
  {
    name: "IF",
    type: OPERATION_TYPES.IF,
    description: "Executes block only if specified condition is true.",
    format: "{0}",
    inputs: [
      {
        label: "Condition",
        type: INPUT_TYPES.TEXT,
        width: 1,
        value: "",
        error: "",
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please enter Variable."
          }
        ]
      },
      {
        label: "If Block",
        type: INPUT_TYPES.OPERATION_BOX,
        operations: [],
        width: 1
      }
    ]
  },
  {
    name: "WHILE",
    type: OPERATION_TYPES.WHILE,
    description: "Executes block untill specified condition become false.",
    format: "{0}",
    inputs: [
      {
        label: "Condition",
        type: INPUT_TYPES.TEXT,
        width: 1,
        value: "",
        error: "",
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please enter Variable."
          }
        ]
      },
      {
        label: "While Block",
        type: INPUT_TYPES.OPERATION_BOX,
        operations: [],
        width: 1
      }
    ]
  }
];
