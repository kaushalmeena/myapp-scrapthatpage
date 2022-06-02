import { LargeOperation } from "../types/largeOperation";
import { OperationTypes } from "./operation";
import { InputTypes } from "./input";
import {
  VariablePickerModes,
  VariableSetterModes,
  VariableTypes
} from "./variable";
import { ValidationTypes } from "./validation";

export const LARGE_OPERATIONS: LargeOperation[] = [
  {
    name: "OPEN",
    type: OperationTypes.OPEN,
    description: "Open url for web scrapping.",
    format: "{0}",
    inputs: [
      {
        label: "URL",
        type: InputTypes.TEXT,
        width: 12,
        value: "",
        error: "",
        variablePicker: {
          type: VariableTypes.ANY,
          mode: VariablePickerModes.APPEND
        },
        rules: [
          {
            type: ValidationTypes.REQUIRED,
            message: "Please enter URL."
          },
          {
            type: ValidationTypes.URL,
            message: "Please enter valid URL."
          }
        ]
      }
    ]
  },
  {
    name: "Extract",
    type: OperationTypes.EXTRACT,
    description: "Scraps specified elements from opened page.",
    format: "{0} [{1}]",
    inputs: [
      {
        label: "Name",
        type: InputTypes.TEXT,
        width: 4,
        value: "",
        error: "",
        rules: [
          {
            type: ValidationTypes.REQUIRED,
            message: "Please enter name."
          }
        ]
      },
      {
        label: "Selector",
        type: InputTypes.TEXT,
        width: 4,
        value: "",
        error: "",
        variablePicker: {
          type: VariableTypes.ANY,
          mode: VariablePickerModes.APPEND
        },
        rules: [
          {
            type: ValidationTypes.REQUIRED,
            message: "Please enter selector."
          }
        ]
      },
      {
        label: "Attribute",
        type: InputTypes.SELECT,
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
            type: ValidationTypes.REQUIRED,
            message: "Please select type."
          }
        ]
      }
    ]
  },
  {
    name: "CLICK",
    type: OperationTypes.CLICK,
    description: "Click on specified element.",
    format: "[{0}]",
    inputs: [
      {
        label: "Selector",
        type: InputTypes.TEXT,
        width: 12,
        value: "",
        error: "",
        variablePicker: {
          type: VariableTypes.ANY,
          mode: VariablePickerModes.APPEND
        },
        rules: [
          {
            type: ValidationTypes.REQUIRED,
            message: "Please enter selector."
          }
        ]
      }
    ]
  },
  {
    name: "TYPE",
    type: OperationTypes.TYPE,
    description: "Type text into specified input.",
    format: "[{0}] {1}",
    inputs: [
      {
        label: "Selector",
        type: InputTypes.TEXT,
        width: 6,
        value: "",
        error: "",
        variablePicker: {
          type: VariableTypes.ANY,
          mode: VariablePickerModes.APPEND
        },
        rules: [
          {
            type: ValidationTypes.REQUIRED,
            message: "Please enter selector."
          }
        ]
      },
      {
        label: "Text",
        type: InputTypes.TEXT,
        width: 6,
        value: "",
        error: "",
        rules: [
          {
            type: ValidationTypes.REQUIRED,
            message: "Please enter text."
          }
        ]
      }
    ]
  },
  {
    name: "SET",
    type: OperationTypes.SET,
    description: "Set specified data to a variable.",
    format: "{0} [{1}]",
    inputs: [
      {
        label: "Variable",
        type: InputTypes.TEXT,
        width: 4,
        value: "",
        error: "",
        variablePicker: {
          type: VariableTypes.ANY,
          mode: VariablePickerModes.SET
        },
        variableSetter: {
          mode: VariableSetterModes.NAME
        },
        rules: [
          {
            type: ValidationTypes.REQUIRED,
            message: "Please enter variable."
          }
        ]
      },
      {
        label: "Type",
        type: InputTypes.SELECT,
        width: 4,
        value: VariableTypes.NUMBER,
        error: "",
        variableSetter: {
          mode: VariableSetterModes.TYPE
        },
        options: [
          {
            label: "Number",
            value: VariableTypes.NUMBER
          },
          {
            label: "String",
            value: VariableTypes.STRING
          }
        ],
        rules: [
          {
            type: ValidationTypes.REQUIRED,
            message: "Please select type."
          }
        ]
      },
      {
        label: "Value",
        type: InputTypes.TEXT,
        width: 4,
        value: "",
        error: "",
        rules: [
          {
            type: ValidationTypes.REQUIRED,
            message: "Please enter value."
          }
        ]
      }
    ]
  },
  {
    name: "INCREASE",
    type: OperationTypes.INCREASE,
    description: "Increase specified variable",
    format: "{0} [+{1}]",
    inputs: [
      {
        label: "Number Variable",
        type: InputTypes.TEXT,
        width: 6,
        value: "",
        error: "",
        variablePicker: {
          type: VariableTypes.NUMBER,
          mode: VariablePickerModes.SET
        },
        inputProps: {
          readOnly: true,
          placeholder: "Select number variable from picker"
        },
        rules: [
          {
            type: ValidationTypes.REQUIRED,
            message: "Please enter number variable."
          }
        ]
      },
      {
        label: "Amount",
        type: InputTypes.TEXT,
        width: 6,
        value: "1",
        error: "",
        inputProps: {
          type: "number"
        },
        rules: [
          {
            type: ValidationTypes.REQUIRED,
            message: "Please enter amount."
          }
        ]
      }
    ]
  },
  {
    name: "DECREASE",
    type: OperationTypes.DECREASE,
    description: "Decrease specified variable",
    format: "{0} [-{1}]",
    inputs: [
      {
        label: "Number Variable",
        type: InputTypes.TEXT,
        width: 6,
        value: "1",
        error: "",
        variablePicker: {
          type: VariableTypes.NUMBER,
          mode: VariablePickerModes.SET
        },
        inputProps: {
          readOnly: true,
          placeholder: "Select number variable from picker"
        },
        rules: [
          {
            type: ValidationTypes.REQUIRED,
            message: "Please enter number variable."
          }
        ]
      },
      {
        label: "Amount",
        type: InputTypes.TEXT,
        width: 6,
        value: "",
        error: "",
        inputProps: {
          type: "number"
        },
        rules: [
          {
            type: ValidationTypes.REQUIRED,
            message: "Please enter amount."
          }
        ]
      }
    ]
  },
  {
    name: "IF",
    type: OperationTypes.IF,
    description: "Executes block only if specified condition is true.",
    format: "{0}",
    inputs: [
      {
        label: "Condition",
        type: InputTypes.TEXT,
        width: 12,
        value: "",
        error: "",
        variablePicker: {
          type: VariableTypes.ANY,
          mode: VariablePickerModes.APPEND
        },
        rules: [
          {
            type: ValidationTypes.REQUIRED,
            message: "Please enter condition."
          }
        ]
      },
      {
        label: "If Block",
        type: InputTypes.OPERATION_BOX,
        operations: []
      }
    ]
  },
  {
    name: "WHILE",
    type: OperationTypes.WHILE,
    description: "Executes block until specified condition become false.",
    format: "{0}",
    inputs: [
      {
        label: "Condition",
        type: InputTypes.TEXT,
        width: 12,
        value: "",
        error: "",
        variablePicker: {
          type: VariableTypes.ANY,
          mode: VariablePickerModes.APPEND
        },
        rules: [
          {
            type: ValidationTypes.REQUIRED,
            message: "Please enter condition."
          }
        ]
      },
      {
        label: "While Block",
        type: InputTypes.OPERATION_BOX,
        operations: []
      }
    ]
  }
];
