import { keys } from "lodash";
import { ActionButtonColor, TableData } from "./types";
import { RunnerStatus } from "./useScriptRunner";

export const getBackgroundColorForStatus = (status: RunnerStatus) => {
  if (status === "error") {
    return "rgba(211, 47, 47, 0.1)";
  }
  if (status === "finished") {
    return "rgba(46, 125, 50, 0.1)";
  }
  return "auto";
};

export const getActionButtonDataForStatus = (
  status: RunnerStatus
): { icon: string; color: ActionButtonColor } => {
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
    default:
      return {
        icon: "play_arrow",
        color: "primary"
      };
  }
};

export const convertToCSV = (tableData: TableData): string => {
  let result = "";
  const headers = keys(tableData[0]);
  result += `${headers.join(",")}\r\n`;
  for (let i = 0; i < tableData.length; i += 1) {
    let line = "";
    keys(tableData[i]).forEach((key) => {
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
  const href = window.URL.createObjectURL(blob);
  const anchorEl = document.createElement("a");
  anchorEl.download = `output.${extension}`;
  anchorEl.href = href;
  anchorEl.click();
  window.URL.revokeObjectURL(href);
};

export const downloadAsCSV = (tableData: TableData): void => {
  const csvString = convertToCSV(tableData);
  saveFile(csvString, "csv", "text/csv");
};

export const downloadAsJSON = (tableData: TableData): void => {
  const jsonString = JSON.stringify(tableData, null, 2);
  saveFile(jsonString, "json", "application/json");
};
