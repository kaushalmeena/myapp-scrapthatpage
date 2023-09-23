import { evaluate } from "mathjs";
import { SmallOperation } from "../../../common/types/smallOperation";
import { VariableMapping } from "../../../common/types/variable";
import {
  ActionButtonData,
  RunnerGenerator,
  RunnerStatus,
  TableData
} from "./types";
import {
  ExtractOperationResult,
  ScraperOperation
} from "../../../common/types/scraper";
import { produce } from "immer";

const replaceWithVariables = (format: string, variables: VariableMapping) =>
  format.replace(/{{[\w-]+}}/g, (match: string) => {
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
      case "open":
        {
          const url = operation.inputs[0].value;
          yield {
            type: operation.type,
            url: replaceWithVariables(url, variables)
          };
        }
        break;
      case "extract":
        {
          const name = operation.inputs[0].value;
          const selector = operation.inputs[1].value;
          const attribute = operation.inputs[2].value;
          yield {
            type: operation.type,
            name,
            selector: replaceWithVariables(selector, variables),
            attribute
          };
        }
        break;
      case "click":
        {
          const selector = operation.inputs[0].value;
          yield {
            type: operation.type,
            selector: replaceWithVariables(selector, variables)
          };
        }
        break;
      case "type":
        {
          const selector = operation.inputs[0].value;
          const text = operation.inputs[1].value;
          yield {
            type: operation.type,
            selector: replaceWithVariables(selector, variables),
            text
          };
        }
        break;
      case "set":
        {
          const name = operation.inputs[0].value;
          const type = operation.inputs[1].value;
          const { value } = operation.inputs[2];
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
      case "increase":
        {
          const name = operation.inputs[0].value;
          const { value } = operation.inputs[1];
          (variables[name] as number) += Number(value);
        }
        break;
      case "decrease":
        {
          const name = operation.inputs[0].value;
          const { value } = operation.inputs[1];
          (variables[name] as number) -= Number(value);
        }
        break;
      case "if":
        {
          const condition = operation.inputs[0].value;
          const { operations: nestedOperations } = operation.inputs[1];
          const formattedCondition = replaceWithVariables(condition, variables);
          const evaluatedValue = evaluate(formattedCondition);
          if (evaluatedValue) {
            yield* getOperationGenerator(nestedOperations, variables);
          }
        }
        break;
      case "while":
        {
          const condition = operation.inputs[0].value;
          const { operations: nestedOperations } = operation.inputs[1];
          let formattedCondition = replaceWithVariables(condition, variables);
          let evaluatedValue = evaluate(formattedCondition);
          while (evaluatedValue) {
            yield* getOperationGenerator(nestedOperations, variables);
            formattedCondition = replaceWithVariables(condition, variables);
            evaluatedValue = evaluate(formattedCondition);
          }
        }
        break;
    }
  }
}

export const processExtractResult = (
  result: ExtractOperationResult,
  tableData: TableData
): TableData =>
  produce(tableData, (draft) => {
    let rowIdx = 0;
    let colIdx = draft.cols.findIndex((col) => col === result.name);

    if (colIdx === -1) {
      colIdx = draft.cols.push(result.name);
    }

    while (rowIdx < draft.rows.length && rowIdx < result.data.length) {
      draft.rows[rowIdx].splice(colIdx, 1, result.data[rowIdx]);
      rowIdx += 1;
    }

    while (rowIdx < result.data.length) {
      const row = [];
      row[colIdx] = result.data[rowIdx];
      draft.rows.push(row);
      rowIdx += 1;
    }
  });

export const getHeaderInfo = (operation: ScraperOperation) => {
  switch (operation.type) {
    case "open":
      return {
        heading: "OPEN",
        message: `${operation.url}`
      };
    case "extract":
      return {
        heading: "EXTRACT",
        message: `${operation.name} [${operation.selector}]`
      };
    case "click":
      return {
        heading: "CLICK",
        message: `[${operation.selector}]`
      };
    case "type":
      return {
        heading: "TYPE",
        message: `[${operation.selector}] ${operation.text}`
      };
  }
};

export const getBackgroundColor = (status: RunnerStatus) => {
  if (status === "error") {
    return "rgba(211, 47, 47, 0.1)";
  }
  if (status === "finished") {
    return "rgba(46, 125, 50, 0.1)";
  }
  return "auto";
};

export const getActionButtonInfo = (status: RunnerStatus): ActionButtonData => {
  switch (status) {
    case "ready":
      return {
        icon: "play_arrow",
        color: "primary"
      };
    case "started":
      return {
        icon: "stop",
        color: "primary"
      };
    case "stopped":
      return {
        icon: "refresh",
        color: "primary"
      };
    case "finished":
      return {
        icon: "refresh",
        color: "success"
      };
    case "error":
      return {
        icon: "refresh",
        color: "error"
      };
  }
};

const convertToCSV = (data: TableData) => {
  let result = `${data.cols}\r\n`;
  for (let i = 0; i < data.rows.length; i += 1) {
    result += `${data.rows[i]}\r\n`;
  }
  return result;
};

const convertToJSON = (data: TableData) => {
  const array = [];
  let result = "";
  for (let i = 0; i < data.rows.length; i += 1) {
    const row: Record<string, string> = {};
    for (let j = 0; j < data.cols.length; j += 1) {
      row[data.cols[j]] = data.rows[i][j] || "";
    }
    array.push(row);
  }
  result = JSON.stringify(array, null, 2);
  return result;
};

const saveFile = (data: string, extension = "txt", type = "text/plain") => {
  const blob = new Blob([data], { type });
  const href = window.URL.createObjectURL(blob);
  const anchorEl = document.createElement("a");
  anchorEl.download = `output.${extension}`;
  anchorEl.href = href;
  anchorEl.click();
  window.URL.revokeObjectURL(href);
};

export const downloadAsCSV = (data: TableData) => {
  const csvString = convertToCSV(data);
  saveFile(csvString, "csv", "text/csv");
};

export const downloadAsJSON = (data: TableData) => {
  const jsonString = convertToJSON(data);
  saveFile(jsonString, "json", "application/json");
};
