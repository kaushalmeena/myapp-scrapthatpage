import { useRef, useState } from "react";
import { ScraperResult } from "../../../common/types/scraper";
import { Script } from "../../types/script";
import { INITIAL_TABLE_DATA } from "./constants";
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
  data: TableData;
  start: () => void;
  stop: () => void;
};

export const useScriptRunner = (script: Script): HookReturnType => {
  const [status, setStatus] = useState<RunnerStatus>("ready");
  const [heading, setHeading] = useState("READY");
  const [message, setMessage] = useState("Ready to start");
  const [data, setData] = useState<TableData>(INITIAL_TABLE_DATA);

  const statusRef = useRef<RunnerStatus>("stopped");
  const generatorRef = useRef<RunnerGenerator>();

  const processResult = (result: ScraperResult) => {
    if (!result) {
      return;
    }
    switch (result.type) {
      case "extract":
        {
          const newData = getRunnerTableData(result, data);
          setData(newData);
        }
        break;
    }
  };

  const executeNext = () => {
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
      .then((response) => {
        if (response.status === "success") {
          processResult(response.result);
          executeNext();
        } else {
          showError(response.message);
        }
      })
      .catch((err) => {
        console.log(err);
        showError("Error occurred in executing operation");
      });
  };

  const start = () => {
    statusRef.current = "started";
    generatorRef.current = getRunnerGenerator(script.operations);
    setStatus("started");
    setHeading("STARTED");
    setMessage("Execution is running");
    executeNext();
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
    data,
    start,
    stop
  };
};
