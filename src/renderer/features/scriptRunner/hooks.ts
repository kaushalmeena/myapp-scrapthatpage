import { useRef, useState } from "react";
import { OperationTypes } from "../../../common/constants/operation";
import { ExecuteResult } from "../../../common/types/scraper";
import { Script } from "../../types/script";
import {
  RunnerExecution,
  RunnerGenerator,
  RunnerStatus,
  ScriptRunnerHook,
  TableData
} from "./types";
import {
  appendExtractResultInTableData,
  getHeadingAndMessageForOperation,
  getOperationGenerator
} from "./utils";

export const useScriptRunner = (script: Script): ScriptRunnerHook => {
  const [status, setStatus] = useState<RunnerStatus>("READY");
  const [heading, setHeading] = useState("READY");
  const [message, setMessage] = useState("Ready to start");
  const [tableData, setTableData] = useState<TableData>([]);

  const execution = useRef<RunnerExecution>("stopped");
  const generator = useRef<RunnerGenerator>(null);

  const stopExecution = () => {
    execution.current = "stopped";
    setStatus("STOPPED");
    setHeading("STOPPED");
    setMessage("Execution is stopped");
  };

  const finishExecution = () => {
    execution.current = "stopped";
    setStatus("FINISHED");
    setHeading("FINISHED");
    setMessage("Execution is finished");
  };

  const showRunnerError = (error: string) => {
    execution.current = "stopped";
    setStatus("ERROR");
    setHeading("ERROR");
    setMessage(error);
  };

  const processResponse = (response: ExecuteResult) => {
    if ("result" in response && response.result) {
      switch (response.result.type) {
        case OperationTypes.EXTRACT:
          {
            const newTableData = appendExtractResultInTableData(
              response.result,
              tableData
            );
            setTableData(newTableData);
          }
          break;
        default:
      }
    }
  };

  const executeNextOperation = () => {
    if (execution.current !== "started") {
      return;
    }

    const operationData = generator.current?.next();
    if (!operationData) {
      showRunnerError("Didn't found any operation to execute");
      return;
    }
    if (operationData.done) {
      finishExecution();
      window.scraper.closeWindow();
      return;
    }

    const operation = operationData.value;

    const { heading: operationHeading, message: operationMessage } =
      getHeadingAndMessageForOperation(operation);
    setHeading(operationHeading);
    setMessage(operationMessage);

    window.scraper
      .runOperation(operation)
      .then((res) => {
        if (res.status === "success") {
          processResponse(res);
          executeNextOperation();
        } else {
          showRunnerError(res.message);
        }
      })
      .catch(() => {
        showRunnerError("Error occurred in executing operation");
      });
  };

  const startRunner = () => {
    execution.current = "started";
    generator.current = getOperationGenerator(script.operations);
    setStatus("STARTED");
    setHeading("STARTED");
    setMessage("Execution is running");
    executeNextOperation();
  };

  return {
    status,
    heading,
    message,
    tableData,
    start: startRunner,
    stop: stopExecution
  };
};
