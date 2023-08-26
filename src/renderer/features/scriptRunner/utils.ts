import { ActionButtonData, TableData } from "./types";
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
): ActionButtonData => {
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

const convertToCSV = (data: TableData) => {
  let result = `${data.headers.join(",")}\r\n`;
  for (let i = 0; i < data.rows.length; i += 1) {
    const line = data.rows[i].map((item) => JSON.stringify(item)).join(",");
    result += `${line}\r\n`;
  }
  return result;
};

const convertToJSON = (data: TableData) => {
  const jsonArray = [];
  for (let i = 0; i < data.rows.length; i += 1) {
    const row: Record<string, string> = {};
    for (let j = 0; j < data.headers.length; j += 1) {
      row[data.headers[j]] = data.rows[i][j] || "";
    }
    jsonArray.push(row);
  }
  const result = JSON.stringify(jsonArray, null, 2);
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
