import { OPERATION_TYPES } from "../../common/constants/operation";
import { ExtractOperationResult } from "../../common/types/scraper";
import { SmallOperation } from "../../common/types/smallOperation";
import {
  getLargeOperation,
  getOperationSubheader
} from "../../common/utils/operation";
import {
  ActionButtonColor,
  OperationNameAndSubheader,
  TableData,
  TableRow
} from "../types/scriptRunner";

export function* operationGenerator(
  operations: SmallOperation[]
): Generator<SmallOperation, void, unknown> {
  for (let i = 0; i < operations.length; i++) {
    const operation = operations[i];
    switch (operation.type) {
      case OPERATION_TYPES.OPEN:
      case OPERATION_TYPES.EXTRACT:
      case OPERATION_TYPES.CLICK:
      case OPERATION_TYPES.TYPE:
        yield operation;
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
  const newData = extractResult.data;
  const newName = extractResult.name;

  const headers = tableData.length ? Object.keys(tableData[0]) : [];
  headers.push(newName);

  for (let i = 0; i < tableData.length; i++) {
    const row: TableRow = {};
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      if (tableData[i][header]) {
        row[header] = tableData[i][header];
      } else if (header === newName) {
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
        if (header === newName) {
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
  operation: SmallOperation
): OperationNameAndSubheader => {
  const largeOperation = getLargeOperation(operation.type);
  return {
    name: largeOperation.name,
    subheader: getOperationSubheader(largeOperation.format, operation.inputs)
  };
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
