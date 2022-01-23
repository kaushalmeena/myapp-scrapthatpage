import { LargeOperation } from "../types/largeOperation";
import { INPUT_TYPES } from "./input";
import { OPERATION_TYPES } from "./operation";
import { VALIDATION_TYPES } from "./validation";
import {
  VARIABLE_PICKER_MODES,
  VARIABLE_SETTER_MODES,
  VARIABLE_TYPES
} from "./variable";

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
        width: 12,
        value: "",
        error: "",
        variablePicker: {
          type: VARIABLE_TYPES.ANY,
          mode: VARIABLE_PICKER_MODES.APPEND
        },
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
        width: 4,
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
        label: "Selector",
        type: INPUT_TYPES.TEXT,
        width: 4,
        value: "",
        error: "",
        variablePicker: {
          type: VARIABLE_TYPES.ANY,
          mode: VARIABLE_PICKER_MODES.APPEND
        },
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please enter selector."
          }
        ]
      },
      {
        label: "Attribute",
        type: INPUT_TYPES.SELECT,
        width: 4,
        value: "text",
        error: "",
        options: [
          {
            label: "Text",
            value: "text"
          },
          {
            label: "Href",
            value: "href"
          }
        ],
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please select type."
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
        label: "Selector",
        type: INPUT_TYPES.TEXT,
        width: 6,
        value: "",
        error: "",
        variablePicker: {
          type: VARIABLE_TYPES.ANY,
          mode: VARIABLE_PICKER_MODES.APPEND
        },
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
        label: "Selector",
        type: INPUT_TYPES.TEXT,
        width: 6,
        value: "",
        error: "",
        variablePicker: {
          type: VARIABLE_TYPES.ANY,
          mode: VARIABLE_PICKER_MODES.APPEND
        },
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
        width: 6,
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
        width: 4,
        value: "",
        error: "",
        variablePicker: {
          type: VARIABLE_TYPES.ANY,
          mode: VARIABLE_PICKER_MODES.SET
        },
        variableSetter: {
          mode: VARIABLE_SETTER_MODES.NAME
        },
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please enter variable."
          }
        ]
      },
      {
        label: "Type",
        type: INPUT_TYPES.SELECT,
        width: 4,
        value: VARIABLE_TYPES.NUMBER,
        error: "",
        variableSetter: {
          mode: VARIABLE_SETTER_MODES.TYPE
        },
        options: [
          {
            label: "Number",
            value: VARIABLE_TYPES.NUMBER
          },
          {
            label: "String",
            value: VARIABLE_TYPES.STRING
          }
        ],
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please select type."
          }
        ]
      },
      {
        label: "Value",
        type: INPUT_TYPES.TEXT,
        width: 4,
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
        label: "Number Variable",
        type: INPUT_TYPES.TEXT,
        width: 6,
        value: "",
        error: "",
        variablePicker: {
          type: VARIABLE_TYPES.NUMBER,
          mode: VARIABLE_PICKER_MODES.SET
        },
        inputProps: {
          readOnly: true,
          placeholder: "Select number variable from picker"
        },
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please enter number variable."
          }
        ]
      },
      {
        label: "Amount",
        type: INPUT_TYPES.TEXT,
        width: 6,
        value: "1",
        error: "",
        inputProps: {
          type: "number"
        },
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
        label: "Number Variable",
        type: INPUT_TYPES.TEXT,
        width: 6,
        value: "1",
        error: "",
        variablePicker: {
          type: VARIABLE_TYPES.NUMBER,
          mode: VARIABLE_PICKER_MODES.SET
        },
        inputProps: {
          readOnly: true,
          placeholder: "Select number variable from picker"
        },
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please enter number variable."
          }
        ]
      },
      {
        label: "Amount",
        type: INPUT_TYPES.TEXT,
        width: 6,
        value: "",
        error: "",
        inputProps: {
          type: "number"
        },
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
        width: 12,
        value: "",
        error: "",
        variablePicker: {
          type: VARIABLE_TYPES.ANY,
          mode: VARIABLE_PICKER_MODES.APPEND
        },
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please enter condition."
          }
        ]
      },
      {
        label: "If Block",
        type: INPUT_TYPES.OPERATION_BOX,
        operations: []
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
        width: 12,
        value: "",
        error: "",
        variablePicker: {
          type: VARIABLE_TYPES.ANY,
          mode: VARIABLE_PICKER_MODES.APPEND
        },
        rules: [
          {
            type: VALIDATION_TYPES.REQUIRED,
            message: "Please enter condition."
          }
        ]
      },
      {
        label: "While Block",
        type: INPUT_TYPES.OPERATION_BOX,
        operations: []
      }
    ]
  }
];
