import type { ScraperResult } from "@common/types/scraper";
import { useRef, useState } from "react";
import db from "@/database";
import {
  selectShowWindow,
  selectStepDelayMs
} from "@/features/settings/settingsSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { Run, RunLogEntry } from "@/types/run";
import type { Script } from "@/types/script";
import type { RunnerGenerator, RunnerStatus, TableData } from "../types";
import {
  createRunnerGenerator,
  getRunnerHeaderInfo,
  getRunnerTableData
} from "../utils/runnerUtils";
import { useElapsedTimer } from "./useElapsedTimer";
import { useRunLog } from "./useRunLog";

type HookReturnType = {
  status: RunnerStatus;
  heading: string;
  message: string;
  result: TableData | null;
  log: RunLogEntry[];
  // Number of steps executed so far in the current/last run.
  stepsCompleted: number;
  // Wall-clock duration of the current/last run, ticking while it runs.
  elapsedMs: number;
  start: () => void;
  stop: () => void;
};

export const useScriptRunner = (script: Script): HookReturnType => {
  const showWindow = useAppSelector(selectShowWindow);
  const stepDelayMs = useAppSelector(selectStepDelayMs);

  const [status, setStatus] = useState<RunnerStatus>("ready");
  const [heading, setHeading] = useState("Ready");
  const [message, setMessage] = useState("Press play to run this script");
  const [result, setResult] = useState<TableData | null>(null);
  const [stepsCompleted, setStepsCompleted] = useState(0);

  const timer = useElapsedTimer();
  const runLog = useRunLog();

  const statusRef = useRef<RunnerStatus>("stopped");
  const generatorRef = useRef<RunnerGenerator | undefined>(undefined);
  // Async callbacks capture stale state, so the latest result is mirrored into
  // a ref for use when persisting the run.
  const resultRef = useRef<TableData | null>(null);
  // Guards against persisting the same run twice (e.g. stop after finish).
  const persistedRef = useRef(false);

  const persistRun = (runStatus: Run["status"]) => {
    if (persistedRef.current) {
      return;
    }
    persistedRef.current = true;
    db.createRun({
      scriptId: script.id,
      scriptName: script.name,
      startedAt: timer.getStartedAt(),
      finishedAt: Date.now(),
      status: runStatus,
      tableData: resultRef.current,
      log: runLog.getEntries()
    }).catch((err) => {
      console.error(err);
    });
  };

  const processScraperResult = (data: ScraperResult) => {
    if (data?.type === "extract") {
      setResult((prev) => {
        const next = getRunnerTableData(data, prev);
        resultRef.current = next;
        return next;
      });
    }
  };

  // Common tail for every run outcome: stop the timer, freeze the status, log
  // the outcome and persist the run.
  const endRun = (outcome: {
    status: RunnerStatus;
    heading: string;
    message: string;
    logStatus: RunLogEntry["status"];
    runStatus: Run["status"];
  }) => {
    timer.stop();
    statusRef.current = "stopped";
    setStatus(outcome.status);
    setHeading(outcome.heading);
    setMessage(outcome.message);
    runLog.append(outcome.heading, outcome.message, outcome.logStatus);
    persistRun(outcome.runStatus);
  };

  const finish = () =>
    endRun({
      status: "finished",
      heading: "Finished",
      message: "All steps completed",
      logStatus: "success",
      runStatus: "finished"
    });

  const stop = () =>
    endRun({
      status: "stopped",
      heading: "Stopped",
      message: "Run stopped before it finished",
      logStatus: "info",
      runStatus: "stopped"
    });

  const showError = (error: string) => {
    window.scraper.closeWindow();
    endRun({
      status: "error",
      heading: "Error",
      message: error,
      logStatus: "error",
      runStatus: "error"
    });
  };

  const executeNextOperation = () => {
    if (statusRef.current !== "started") {
      return;
    }

    const operationData = generatorRef.current?.next();
    if (!operationData) {
      return;
    }

    if (operationData.done) {
      finish();
      window.scraper.closeWindow();
      return;
    }

    const operation = operationData.value;
    if (!operation) {
      showError("This script has no steps to run.");
      return;
    }

    const info = getRunnerHeaderInfo(operation);
    setHeading(info.heading);
    setMessage(info.message);
    runLog.append(info.heading, info.message, "info");

    window.scraper
      .runOperation(operation)
      .then((res) => {
        if (res.status !== "success") {
          showError(res.message);
          return;
        }
        setStepsCompleted((prev) => prev + 1);
        processScraperResult(res.result);
        // Politeness delay between operations; the guard at the top of
        // executeNextOperation re-checks the status once the timer fires.
        if (stepDelayMs > 0) {
          setTimeout(executeNextOperation, stepDelayMs);
        } else {
          executeNextOperation();
        }
      })
      .catch((err) => {
        console.error(err);
        showError("Something went wrong while running this step.");
      });
  };

  const start = () => {
    window.scraper.configure({ showWindow });
    statusRef.current = "started";
    generatorRef.current = createRunnerGenerator(script.operations);
    resultRef.current = null;
    persistedRef.current = false;
    setResult(null);
    setStepsCompleted(0);
    runLog.reset();
    timer.start();
    setStatus("started");
    setHeading("Running");
    setMessage("Working through the script steps…");
    executeNextOperation();
  };

  return {
    status,
    heading,
    message,
    result,
    log: runLog.log,
    stepsCompleted,
    elapsedMs: timer.elapsedMs,
    start,
    stop
  };
};
