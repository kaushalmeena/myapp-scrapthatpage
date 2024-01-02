import { useRef, useState } from "react";
import { ScraperResult } from "../../../common/types/scraper";
import { Script } from "../../types/script";
import { RunnerGenerator, RunnerStatus, TableData } from "./types";
import {
  getRunnerGenerator,
  getRunnerHeaderInfo,
  getRunnerTableData
} from "./utils";

type HookReturnType = {
  status: RunnerStatus;
  heading: string;
  message: string;
  result: TableData | null;
  start: () => void;
  stop: () => void;
};

export const useScriptRunner = (script: Script): HookReturnType => {
  const [status, setStatus] = useState<RunnerStatus>("ready");
  const [heading, setHeading] = useState("READY");
  const [message, setMessage] = useState("Ready to start");
  const [result, setResult] = useState<TableData | null>(null);

  const statusRef = useRef<RunnerStatus>("stopped");
  const generatorRef = useRef<RunnerGenerator>();

  const processScraperResult = (data: ScraperResult) => {
    if (!data) {
      return;
    }
    switch (data.type) {
      case "extract":
        setResult((prev) => getRunnerTableData(data, prev));
        break;
    }
  };

  const executeNextOperation = () => {
    if (statusRef.current !== "started") {
      return;
    }

    const operationData = generatorRef.current?.next();

    if (operationData.done) {
      finish();
      window.scraper.closeWindow();
      return;
    }

    const operation = operationData.value;
    if (!operation) {
      showError("Didn't found any operation to execute");
      return;
    }

    const { heading, message } = getRunnerHeaderInfo(operation);
    setHeading(heading);
    setMessage(message);

    window.scraper
      .runOperation(operation)
      .then((res) => {
        if (res.status === "success") {
          processScraperResult(res.result);
          executeNextOperation();
        } else {
          showError(res.message);
        }
      })
      .catch((err) => {
        console.error(err);
        showError("Error occurred in executing operation");
      });
  };

  const start = () => {
    statusRef.current = "started";
    generatorRef.current = getRunnerGenerator(script.operations);
    setResult(null);
    setStatus("started");
    setHeading("STARTED");
    setMessage("Execution is running");
    executeNextOperation();
  };

  const stop = () => {
    statusRef.current = "stopped";
    setStatus("stopped");
    setHeading("STOPPED");
    setMessage("Execution is stopped");
  };

  const finish = () => {
    statusRef.current = "stopped";
    setStatus("finished");
    setHeading("FINISHED");
    setMessage("Execution is finished");
  };

  const showError = (error: string) => {
    window.scraper.closeWindow();
    statusRef.current = "stopped";
    setStatus("error");
    setHeading("ERROR");
    setMessage(error);
  };

  return {
    status,
    heading,
    message,
    result,
    start,
    stop
  };
};
