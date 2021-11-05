import { OPERATION_TYPES } from "../../common/constants/operation";
import { SmallOperation } from "../../common/types/smallOperation";

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

export const downloadAsCSV = (data: any[]) => {
  const csvString = convertToCSV(data);
  saveFile(csvString, "text/csv");
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

export const convertToCSV = (data: any[]): string => {
  let result = "";
  const tempArray = data;

  const headers = Object.keys(tempArray[0]);
  tempArray.unshift(headers);

  for (let i = 0; i < tempArray.length; i++) {
    let line = "";
    for (const key in tempArray[i]) {
      if (line != "") {
        line += ",";
      }
      line += tempArray[i][key];
    }
    result += line + "\r\n";
  }

  return result;
};
