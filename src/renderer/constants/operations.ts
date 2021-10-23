import { IOperation } from "../interfaces/operations";

export enum OPERATION_TYPES {
  OPEN = "OPEN",
  EXTRACT = "EXTRACT",
  CLICK = "CLICK",
  TYPE = "TYPE",
  SET = "SET",
  IF = "IF",
  IF_ELSE = "IF_ELSE",
  REPEAT = "REPEAT",
  REPEAT_UNTIL = "REPEAT_UNTIL",
  REPEAT_WHILE = "REPEAT_WHILE"
}

export enum CATEGORY_TYPES {
  ACTION = "ACTION",
  CONDITION = "CONDITION",
  LOOP = "LOOP"
}

export const OPERTAIONS: IOperation[] = [
  {
    type: OPERATION_TYPES.OPEN,
    category: CATEGORY_TYPES.ACTION,
    description: "Open url for web scrapping.",
    format: "{0}"
  },
  {
    type: OPERATION_TYPES.EXTRACT,
    category: CATEGORY_TYPES.ACTION,
    description: "Scraps specified elements from opened page.",
    format: "{0} [{1}]"
  },
  {
    type: OPERATION_TYPES.CLICK,
    category: CATEGORY_TYPES.ACTION,
    description: "Click on specified element.",
    format: "[{0}]"
  },
  {
    type: OPERATION_TYPES.TYPE,
    category: CATEGORY_TYPES.ACTION,
    description: "Type text into specified input.",
    format: "[{0}] {1}"
  },
  {
    type: OPERATION_TYPES.SET,
    category: CATEGORY_TYPES.ACTION,
    description: "Set specified data to a variable.",
    format: "{0} [{1}]"
  },
  {
    type: OPERATION_TYPES.IF,
    category: CATEGORY_TYPES.CONDITION,
    description: "Executes block only if specified condition is true.",
    format: "{0}"
  },
  {
    type: OPERATION_TYPES.REPEAT,
    category: CATEGORY_TYPES.LOOP,
    description: "Executes block specified number of times.",
    format: "{0}"
  },
  {
    type: OPERATION_TYPES.REPEAT_UNTIL,
    category: CATEGORY_TYPES.LOOP,
    description: "Executes block untill specified condition become false.",
    format: "{0}"
  },
  {
    type: OPERATION_TYPES.REPEAT_WHILE,
    category: CATEGORY_TYPES.LOOP,
    description: "Executes block untill specified condition become false.",
    format: "{0}"
  }
];
