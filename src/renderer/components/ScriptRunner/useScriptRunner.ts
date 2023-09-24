import { useRef, useState } from "react";
import { Script } from "../../types/script";
import { INITIAL_TABLE_DATA } from "./constants";
import { RunnerGenerator, RunnerStatus, TableData } from "./types";
import {
  getRunnerHeaderInfo,
  getRunnerGenerator,
  getRunnerTableData
} from "./utils";
import { ExecuteResponse } from "../../../common/types/scraper";

type HookReturnType = {
  status: RunnerStatus;
  heading: string;
  message: string;
  tableData: TableData;
  start: () => void;
  stop: () => void;
};

export const useScriptRunner = (script: Script): HookReturnType => {
  const [status, setStatus] = useState<RunnerStatus>("ready");
  const [heading, setHeading] = useState("READY");
  const [message, setMessage] = useState("Ready to start");
  const [tableData, setTableData] = useState<TableData>(INITIAL_TABLE_DATA);

  const statusRef = useRef<RunnerStatus>("stopped");
  const generatorRef = useRef<RunnerGenerator>(null);

  const processResponse = (response: ExecuteResponse) => {
    if ("result" in response && response.result) {
      switch (response.result.type) {
        case "extract":
          {
            const newTableData = getRunnerTableData(response.result, tableData);
            setTableData(newTableData);
          }
          break;
      }
    }
  };

  const executeNextOperation = () => {
    if (statusRef.current !== "started") {
      return;
    }

    const operationData = generatorRef.current?.next();

    if (operationData.done) {
      finishExecution();
      window.scraper.closeWindow();
      return;
    }

    const operation = operationData.value;
    if (!operation) {
      showExecutionError("Didn't found any operation to execute");
      return;
    }

    const { heading, message } = getRunnerHeaderInfo(operation);
    setHeading(heading);
    setMessage(message);

    window.scraper
      .runOperation(operation)
      .then((res) => {
        if (res.status === "success") {
          processResponse(res);
          executeNextOperation();
        } else {
          showExecutionError(res.message);
        }
      })
      .catch(() => {
        showExecutionError("Error occurred in executing operation");
      });
  };

  const startExecution = () => {
    statusRef.current = "started";
    generatorRef.current = getRunnerGenerator(script.operations);
    setStatus("started");
    setHeading("STARTED");
    setMessage("Execution is running");
    executeNextOperation();
  };

  const stopExecution = () => {
    statusRef.current = "stopped";
    setStatus("stopped");
    setHeading("STOPPED");
    setMessage("Execution is stopped");
  };

  const finishExecution = () => {
    statusRef.current = "stopped";
    setStatus("finished");
    setHeading("FINISHED");
    setMessage("Execution is finished");
  };

  const showExecutionError = (error: string) => {
    statusRef.current = "stopped";
    setStatus("error");
    setHeading("ERROR");
    setMessage(error);
  };

  return {
    status,
    heading,
    message,
    tableData,
    start: startExecution,
    stop: stopExecution
  };
};
