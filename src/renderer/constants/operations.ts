import { Operation } from "../types/operation";
import { VALIDATION_TYPES } from "./validation";

export enum OPERATION_TYPES {
  OPEN,
  EXTRACT,
  CLICK,
  TYPE,
  SET,
  IF,
  IF_ELSE,
  REPEAT,
  REPEAT_UNTIL,
  REPEAT_WHILE
}

export enum INPUT_TYPES {
  TEXT,
  TEXTAREA,
  OPERATION_BOX,
  VARIABLE_BOX
}

export const OPERTAIONS: Operation[] = [
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
        width: 6,
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
        width: 6,
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
  }
  // {
  //   type: OPERATION_TYPES.CLICK,
  //   description: "Click on specified element.",
  //   format: "[{0}]"
  // },
  // {
  //   type: OPERATION_TYPES.TYPE,
  //   description: "Type text into specified input.",
  //   format: "[{0}] {1}"
  // },
  // {
  //   type: OPERATION_TYPES.SET,
  //   description: "Set specified data to a variable.",
  //   format: "{0} [{1}]"
  // },
  // {
  //   type: OPERATION_TYPES.IF,
  //   description: "Executes block only if specified condition is true.",
  //   format: "{0}"
  // },
  // {
  //   type: OPERATION_TYPES.REPEAT,
  //   description: "Executes block specified number of times.",
  //   format: "{0}"
  // },
  // {
  //   type: OPERATION_TYPES.REPEAT_UNTIL,
  //   description: "Executes block untill specified condition become false.",
  //   format: "{0}"
  // },
  // {
  //   type: OPERATION_TYPES.REPEAT_WHILE,
  //   description: "Executes block untill specified condition become false.",
  //   format: "{0}"
  // }
];
