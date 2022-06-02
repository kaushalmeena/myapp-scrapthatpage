import { evaluate } from "mathjs";
import { OperationTypes } from "../../../common/constants/operation";
import { VariableTypes } from "../../../common/constants/variable";
import {
  ExtractOperationResult,
  ScraperOperation
} from "../../../common/types/scraper";
import { SmallOperation } from "../../../common/types/smallOperation";
import { VariableMapping } from "../../../common/types/variable";
import {
  HeadingAndMessage,
  IconAndColor,
  RunnerGenerator,
  RunnerStatus,
  TableData,
  TableRow
} from "./types";

export const replaceTextWithVariables = (
  text: string,
  variables: VariableMapping
): string =>
  text.replace(/{{[\w-]+}}/g, (match: string) => {
    const name = match.slice(2, -2);
    const value = variables[name];
    return String(value);
  });

export function* getOperationGenerator(
  operations: SmallOperation[],
  variables: VariableMapping = {}
): RunnerGenerator {
  for (let i = 0; i < operations.length; i += 1) {
    const operation = operations[i];
    switch (operation.type) {
      case OperationTypes.OPEN:
        {
          const url = operation.inputs[0].value;
          yield {
            type: operation.type,
            url: replaceTextWithVariables(url, variables)
          };
        }
        break;
      case OperationTypes.EXTRACT:
        {
          const name = operation.inputs[0].value;
          const selector = operation.inputs[1].value;
          const attribute = operation.inputs[2].value;
          yield {
            type: operation.type,
            name,
            selector: replaceTextWithVariables(selector, variables),
            attribute
          };
        }
        break;
      case OperationTypes.CLICK:
        {
          const selector = operation.inputs[0].value;
          yield {
            type: operation.type,
            selector: replaceTextWithVariables(selector, variables)
          };
        }
        break;
      case OperationTypes.TYPE:
        {
          const selector = operation.inputs[0].value;
          const text = operation.inputs[1].value;
          yield {
            type: operation.type,
            selector: replaceTextWithVariables(selector, variables),
            text
          };
        }
        break;
      case OperationTypes.SET:
        {
          const name = operation.inputs[0].value;
          const type = operation.inputs[1].value;
          const { value } = operation.inputs[2];
          switch (type) {
            case VariableTypes.STRING:
              variables[name] = String(value);
              break;
            case VariableTypes.NUMBER:
              variables[name] = Number(value);
              break;
            default:
          }
        }
        break;
      case OperationTypes.INCREASE:
        {
          const name = operation.inputs[0].value;
          const { value } = operation.inputs[1];
          (variables[name] as number) += Number(value);
        }
        break;
      case OperationTypes.DECREASE:
        {
          const name = operation.inputs[0].value;
          const { value } = operation.inputs[1];
          (variables[name] as number) -= Number(value);
        }
        break;
      case OperationTypes.IF:
        {
          const condition = operation.inputs[0].value;
          const { operations: nestedOperations } = operation.inputs[1];
          const formattedCondition = replaceTextWithVariables(
            condition,
            variables
          );
          const evaluatedValue = evaluate(formattedCondition);
          if (evaluatedValue) {
            yield* getOperationGenerator(nestedOperations, variables);
          }
        }
        break;
      case OperationTypes.WHILE:
        {
          const condition = operation.inputs[0].value;
          const { operations: nestedOperations } = operation.inputs[1];
          let formattedCondition = replaceTextWithVariables(
            condition,
            variables
          );
          let evaluatedValue = evaluate(formattedCondition);
          while (evaluatedValue) {
            yield* getOperationGenerator(nestedOperations, variables);
            formattedCondition = replaceTextWithVariables(condition, variables);
            evaluatedValue = evaluate(formattedCondition);
          }
        }
        break;
      default:
    }
  }
}

export const appendExtractResultInTableData = (
  result: ExtractOperationResult,
  tableData: TableData
): TableData => {
  const newTableData: TableData = [];
  const { name, data } = result;

  const headers = tableData.length ? Object.keys(tableData[0]) : [];
  headers.push(name);

  for (let i = 0; i < tableData.length; i += 1) {
    const row: TableRow = {};
    for (let j = 0; j < headers.length; j += 1) {
      const header = headers[j];
      if (tableData[i][header]) {
        row[header] = tableData[i][header];
      } else if (header === name) {
        row[header] = data.shift() || "";
      }
    }
    newTableData.push(row);
  }

  if (data.length > 0) {
    for (let i = 0; i < data.length; i += 1) {
      const row: TableRow = {};
      for (let j = 0; j < headers.length; j += 1) {
        const header = headers[j];
        if (header === name) {
          row[header] = data.shift() || "";
        } else {
          row[header] = "";
        }
      }
      newTableData.push(row);
    }
  }

  return newTableData;
};

export const getHeadingAndMessageForOperation = (
  operation: ScraperOperation
): HeadingAndMessage => {
  switch (operation.type) {
    case OperationTypes.OPEN:
      return {
        heading: "OPEN",
        message: `${operation.url}`
      };
    case OperationTypes.EXTRACT:
      return {
        heading: "EXTRACT",
        message: `${operation.name} [${operation.selector}]`
      };
    case OperationTypes.CLICK:
      return {
        heading: "CLICK",
        message: `[${operation.selector}]`
      };
    case OperationTypes.TYPE:
      return {
        heading: "TYPE",
        message: `[${operation.selector}] ${operation.text}`
      };
    default:
      return {
        heading: "UNKNOWN",
        message: ""
      };
  }
};

export const getBackgroundColorForStatus = (status: RunnerStatus): string => {
  if (status === "ERROR") {
    return "rgba(211, 47, 47, 0.1)";
  }
  if (status === "FINISHED") {
    return "rgba(46, 125, 50, 0.1)";
  }
  return "auto";
};

export const getIconAndColorForStatus = (
  status: RunnerStatus
): IconAndColor => {
  switch (status) {
    case "READY":
      return {
        icon: "play_arrow",
        color: "primary"
      };
    case "STARTED":
      return {
        icon: "stop",
        color: "primary"
      };
    case "STOPPED":
      return {
        icon: "refresh",
        color: "primary"
      };
    case "FINISHED":
      return {
        icon: "refresh",
        color: "success"
      };
    case "ERROR":
      return {
        icon: "refresh",
        color: "error"
      };
    default:
      return {
        icon: "play_arrow",
        color: "primary"
      };
  }
};

export const convertToCSV = (tableData: TableData): string => {
  let result = "";
  const headers = Object.keys(tableData[0]);
  result += `${headers.join(",")}\r\n`;
  for (let i = 0; i < tableData.length; i += 1) {
    let line = "";
    Object.keys(tableData[i]).forEach((key) => {
      if (line !== "") {
        line += ",";
      }
      line += tableData[i][key];
    });
    result += `${line}\r\n`;
  }
  return result;
};

export const saveFile = (
  data: string,
  extension = "txt",
  type = "text/plain"
): void => {
  const blob = new Blob([data], { type });
  const a = document.createElement("a");
  a.download = `output.${extension}`;
  a.href = window.URL.createObjectURL(blob);
  a.click();
};

export const downloadAsCSV = (tableData: TableData): void => {
  const csvString = convertToCSV(tableData);
  saveFile(csvString, "csv", "text/csv");
};

export const downloadAsJSON = (tableData: TableData): void => {
  const jsonString = JSON.stringify(tableData, null, 2);
  saveFile(jsonString, "json", "application/json");
};
