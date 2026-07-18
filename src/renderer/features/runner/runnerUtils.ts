import { Play, RotateCw, Square } from "lucide-react";
import { produce } from "immer";
import { evaluate } from "mathjs";
import {
  ExtractOperationResult,
  ScraperOperation
} from "../../../common/types/scraper";
import { SmallOperation } from "../../../common/types/smallOperation";
import { VariableMapping } from "../../../common/types/variable";
import { INITIAL_TABLE_DATA } from "./constants";
import {
  RunnerCardInfo,
  RunnerGenerator,
  RunnerHeaderInfo,
  RunnerStatus,
  TableData
} from "./types";

// Upper bound on `while` loop iterations to prevent an ill-formed condition
// from locking up the renderer.
const MAX_WHILE_ITERATIONS = 100000;

// Substitutes runtime `{{name}}` tokens in a value with the current value of
// the corresponding script variable. Used at execution time (distinct from the
// editor's single-brace `{index}` display tokens in common/utils/operation.ts).
const replaceFormatWithVariables = (
  format: string,
  variables: VariableMapping
) =>
  format.replace(/{{[\w-]+}}/g, (match: string) => {
    const name = match.slice(2, -2);
    const value = variables[name];
    return String(value);
  });

// Walks a script's operations and yields one browser-facing operation (open,
// extract, click, type) at a time for the runner hook to dispatch over IPC.
// Control-flow and variable operations (set/increase/decrease/if/while) are
// evaluated here in the renderer and don't yield; if/while recurse into their
// nested operations, sharing the same mutable `variables` map.
export function* getRunnerGenerator(
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
            url: replaceFormatWithVariables(url, variables)
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
            selector: replaceFormatWithVariables(selector, variables),
            attribute
          };
        }
        break;
      case "click":
        {
          const selector = operation.inputs[0].value;
          yield {
            type: operation.type,
            selector: replaceFormatWithVariables(selector, variables)
          };
        }
        break;
      case "type":
        {
          const selector = operation.inputs[0].value;
          const text = operation.inputs[1].value;
          yield {
            type: operation.type,
            selector: replaceFormatWithVariables(selector, variables),
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
          const formattedCondition = replaceFormatWithVariables(
            condition,
            variables
          );
          const evaluatedValue = evaluate(formattedCondition);
          if (evaluatedValue) {
            yield* getRunnerGenerator(nestedOperations, variables);
          }
        }
        break;
      case "while":
        {
          const condition = operation.inputs[0].value;
          const { operations: nestedOperations } = operation.inputs[1];
          let formattedCondition = replaceFormatWithVariables(
            condition,
            variables
          );
          let evaluatedValue = evaluate(formattedCondition);
          let iterations = 0;
          while (evaluatedValue) {
            // Guard against a condition that never becomes falsy (e.g. a loop
            // body with no scraper step) freezing the renderer indefinitely.
            iterations += 1;
            if (iterations > MAX_WHILE_ITERATIONS) {
              throw new Error(
                `"while" loop exceeded ${MAX_WHILE_ITERATIONS} iterations`
              );
            }
            yield* getRunnerGenerator(nestedOperations, variables);
            formattedCondition = replaceFormatWithVariables(
              condition,
              variables
            );
            evaluatedValue = evaluate(formattedCondition);
          }
        }
        break;
    }
  }
}

// Merges one extract result into the accumulating table. Columns are keyed by
// the extract's name (reused if already present, otherwise appended) and rows
// are filled by index, so repeated extracts into the same column overwrite and
// longer results grow the table.
export const getRunnerTableData = (
  result: ExtractOperationResult,
  oldTableData?: TableData | null
): TableData =>
  produce(oldTableData || INITIAL_TABLE_DATA, (draft) => {
    let rowIdx = 0;
    let colIdx = draft.cols.findIndex((col) => col === result.name);

    if (colIdx === -1) {
      // push() returns the new length, so the appended column's index is one
      // less. Using the length directly left a gap and shifted every export.
      colIdx = draft.cols.push(result.name) - 1;
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

export const getRunnerHeaderInfo = (
  operation: ScraperOperation
): RunnerHeaderInfo => {
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

export const getRunnerCardInfo = (status: RunnerStatus): RunnerCardInfo => {
  switch (status) {
    case "ready":
      return {
        title: "Start execution",
        color: "default",
        Icon: Play
      };
    case "started":
      return {
        title: "Stop execution",
        color: "default",
        Icon: Square
      };
    case "stopped":
      return {
        title: "Restart execution",
        color: "default",
        Icon: RotateCw
      };
    case "finished":
      return {
        title: "Restart execution",
        color: "success",
        tone: "success",
        Icon: RotateCw
      };
    case "error":
      return {
        title: "Restart execution",
        color: "destructive",
        tone: "error",
        Icon: RotateCw
      };
  }
};

// Quote a CSV field only when it contains a delimiter, quote, or newline,
// escaping embedded quotes by doubling them (RFC 4180).
const escapeCSVField = (value: string) =>
  /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

const convertToCSV = (data: TableData) => {
  const toRow = (cells: string[]) =>
    data.cols.map((_, colIdx) => escapeCSVField(cells[colIdx] || "")).join(",");

  const header = data.cols.map(escapeCSVField).join(",");
  const body = data.rows.map(toRow);
  return [header, ...body].join("\r\n");
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
