import { evaluate } from "mathjs";
import { OPERATION_TYPES } from "../../common/constants/operation";
import {
  ExtractOperationResult,
  ScraperOperation
} from "../../common/types/scraper";
import { SmallOperation } from "../../common/types/smallOperation";
import { VariableMapping } from "../../common/types/variable";
import {
  ActionButtonColor,
  OperationNameAndSubheader,
  TableData,
  TableRow
} from "../types/scriptRunner";

export const replaceWithVariables = (
  text: string,
  variables: VariableMapping
): string =>
  text.replace(/{{[\w-]+}}/g, (match: string) => {
    const name = match.slice(2, -2);
    const value = variables[name];
    return String(value);
  });

export function* operationGenerator(
  operations: SmallOperation[],
  variables: VariableMapping = {}
): Generator<ScraperOperation, void, ScraperOperation> {
  for (let i = 0; i < operations.length; i++) {
    const operation = operations[i];
    switch (operation.type) {
      case OPERATION_TYPES.OPEN:
        {
          const url = operation.inputs[0].value;
          yield {
            type: operation.type,
            url: replaceWithVariables(url, variables)
          };
        }
        break;
      case OPERATION_TYPES.EXTRACT:
        {
          const name = operation.inputs[0].value;
          const selector = operation.inputs[1].value;
          const attribute = operation.inputs[2].value;
          yield {
            type: operation.type,
            name: name,
            selector: replaceWithVariables(selector, variables),
            attribute: attribute
          };
        }
        break;
      case OPERATION_TYPES.CLICK:
        {
          const selector = operation.inputs[0].value;
          yield {
            type: operation.type,
            selector: replaceWithVariables(selector, variables)
          };
        }
        break;
      case OPERATION_TYPES.TYPE:
        {
          const selector = operation.inputs[0].value;
          const text = operation.inputs[1].value;
          yield {
            type: operation.type,
            selector: replaceWithVariables(selector, variables),
            text: text
          };
        }
        break;
      case OPERATION_TYPES.SET:
        {
          const name = operation.inputs[0].value;
          const type = operation.inputs[1].value;
          const value = operation.inputs[2].value;
          switch (type) {
            case "string":
              variables[name] = String(value);
              break;
            case "number":
              variables[name] = Number(value);
              break;
          }
        }
        break;
      case OPERATION_TYPES.INCREASE:
        {
          const name = operation.inputs[0].value;
          const value = operation.inputs[1].value;
          (variables[name] as number) += Number(value);
        }
        break;
      case OPERATION_TYPES.DECREASE:
        {
          const name = operation.inputs[0].value;
          const value = operation.inputs[1].value;
          (variables[name] as number) -= Number(value);
        }
        break;
      case OPERATION_TYPES.IF:
        {
          const condition = operation.inputs[0].value;
          const operations = operation.inputs[1].operations;
          const formattedCondition = replaceWithVariables(condition, variables);
          const evaluatedValue = evaluate(formattedCondition);
          if (evaluatedValue) {
            yield* operationGenerator(operations, variables);
          }
        }
        break;
      case OPERATION_TYPES.WHILE:
        {
          const condition = operation.inputs[0].value;
          const operations = operation.inputs[1].operations;
          let formattedCondition = replaceWithVariables(condition, variables);
          let evaluatedValue = evaluate(formattedCondition);
          while (evaluatedValue) {
            yield* operationGenerator(operations, variables);
            formattedCondition = replaceWithVariables(condition, variables);
            evaluatedValue = evaluate(formattedCondition);
          }
        }
        break;
    }
  }
  return;
}

export const getCardBackgroundColor = (color: ActionButtonColor): string => {
  if (color === "error") {
    return "rgba(211, 47, 47, 0.1)";
  }
  if (color === "success") {
    return "rgba(46, 125, 50, 0.1)";
  }
  return "auto";
};

export const appendExtractResultInTableData = (
  extractResult: ExtractOperationResult,
  tableData: TableData
): TableData => {
  const newTableData: TableData = [];
  const newData = extractResult.result;
  const newHeader = extractResult.name;

  const headers = tableData.length ? Object.keys(tableData[0]) : [];
  headers.push(newHeader);

  for (let i = 0; i < tableData.length; i++) {
    const row: TableRow = {};
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      if (tableData[i][header]) {
        row[header] = tableData[i][header];
      } else if (header === newHeader) {
        row[header] = newData.shift() || "";
      }
    }
    newTableData.push(row);
  }

  if (newData.length > 0) {
    for (let i = 0; i < newData.length; i++) {
      const row: TableRow = {};
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        if (header === newHeader) {
          row[header] = newData.shift() || "";
        } else {
          row[header] = "";
        }
      }
      newTableData.push(row);
    }
  }

  return newTableData;
};

export const getOperationNameAndSubheader = (
  operation: ScraperOperation
): OperationNameAndSubheader => {
  switch (operation.type) {
    case OPERATION_TYPES.OPEN:
      return {
        name: "OPEN",
        subheader: `${operation.url}`
      };
    case OPERATION_TYPES.EXTRACT:
      return {
        name: "EXTARCT",
        subheader: `${operation.name} [${operation.selector}]`
      };
    case OPERATION_TYPES.CLICK:
      return {
        name: "EXTARCT",
        subheader: `[${operation.selector}]`
      };
    case OPERATION_TYPES.TYPE:
      return {
        name: "EXTARCT",
        subheader: `[${operation.selector}] ${operation.text}`
      };
  }
};

export const downloadAsCSV = (tableData: TableData): void => {
  const csvString = convertToCSV(tableData);
  saveFile(csvString, "csv", "text/csv");
};

export const convertToCSV = (tableData: TableData): string => {
  let result = "";
  const headers = Object.keys(tableData[0]);
  result += headers.join(",") + "\r\n";
  for (let i = 0; i < tableData.length; i++) {
    let line = "";
    for (const key in tableData[i]) {
      if (line != "") {
        line += ",";
      }
      line += tableData[i][key];
    }
    result += line + "\r\n";
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
