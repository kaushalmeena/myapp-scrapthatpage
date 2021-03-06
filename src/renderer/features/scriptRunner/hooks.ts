import { useRef, useState } from "react";
import { OperationTypes } from "../../../common/constants/operation";
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

  const handleRunnerStop = () => {
    execution.current = "stopped";
    setStatus("STOPPED");
    setHeading("STOPPED");
    setMessage("Execution is stopped");
  };

  const handleRunnerFinish = () => {
    execution.current = "stopped";
    setStatus("FINISHED");
    setHeading("FINISHED");
    setMessage("Execution is finished");
  };

  const handleRunnerError = (errorMessage: string) => {
    execution.current = "stopped";
    setStatus("ERROR");
    setHeading("ERROR");
    setMessage(errorMessage);
  };

  const handleNextOperation = () => {
    if (execution.current !== "started") {
      return;
    }

    const operationData = generator.current?.next();
    if (!operationData) {
      handleRunnerError("Didn't found any operation to execute");
      return;
    }
    if (operationData.done) {
      handleRunnerFinish();
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
      .then((response) => {
        if (response.status === "success") {
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
          handleNextOperation();
        } else {
          handleRunnerError(response.message);
        }
      })
      .catch(() => {
        handleRunnerError("Error occurred in executing operation");
      });
  };

  const handleRunnerStart = () => {
    execution.current = "started";
    generator.current = getOperationGenerator(script.operations);
    setStatus("STARTED");
    setHeading("STARTED");
    setMessage("Execution is running");
    handleNextOperation();
  };

  return {
    status,
    heading,
    message,
    tableData,
    start: handleRunnerStart,
    stop: handleRunnerStop
  };
};
