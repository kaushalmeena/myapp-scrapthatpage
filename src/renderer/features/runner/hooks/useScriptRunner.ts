import { useEffect, useRef, useState } from "react";
import db from "@/database";
import {
  selectOperationDelayMs,
  selectShowScraperWindow
} from "@/features/settings/settingsSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { Run, RunLogEntry } from "@/types/run";
import type { Script } from "@/types/script";
import type { ScraperResult } from "../../../../common/types/scraper";
import type { RunnerGenerator, RunnerStatus, TableData } from "../types";
import {
  getRunnerGenerator,
  getRunnerHeaderInfo,
  getRunnerTableData
} from "../utils/runnerUtils";

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
  const showScraperWindow = useAppSelector(selectShowScraperWindow);
  const operationDelayMs = useAppSelector(selectOperationDelayMs);

  const [status, setStatus] = useState<RunnerStatus>("ready");
  const [heading, setHeading] = useState("Ready");
  const [message, setMessage] = useState("Press play to run this script");
  const [result, setResult] = useState<TableData | null>(null);
  const [log, setLog] = useState<RunLogEntry[]>([]);
  const [stepsCompleted, setStepsCompleted] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  const statusRef = useRef<RunnerStatus>("stopped");
  const generatorRef = useRef<RunnerGenerator | undefined>(undefined);
  // Async operation callbacks capture stale state, so the latest result and
  // log are mirrored into refs for use when persisting the run.
  const resultRef = useRef<TableData | null>(null);
  const logRef = useRef<RunLogEntry[]>([]);
  const startedAtRef = useRef(0);
  // Guards against persisting the same run twice (e.g. stop after finish).
  const persistedRef = useRef(false);
  // Ticks the elapsed-time display while a run is in progress.
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined
  );

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
    if (startedAtRef.current > 0) {
      setElapsedMs(Date.now() - startedAtRef.current);
    }
  };

  // Clear the ticker if the screen unmounts mid-run. Mount/unmount only, so
  // stopTimer is intentionally not a dependency.
  // biome-ignore lint/correctness/useExhaustiveDependencies: unmount-only cleanup
  useEffect(() => stopTimer, []);

  const appendLogEntry = (
    entryHeading: string,
    entryMessage: string,
    entryStatus: RunLogEntry["status"]
  ) => {
    const entry: RunLogEntry = {
      timestamp: Date.now(),
      heading: entryHeading,
      message: entryMessage,
      status: entryStatus
    };
    logRef.current = [...logRef.current, entry];
    setLog(logRef.current);
  };

  const persistRun = (runStatus: Run["status"]) => {
    if (persistedRef.current) {
      return;
    }
    persistedRef.current = true;
    db.createRun({
      scriptId: script.id,
      scriptName: script.name,
      startedAt: startedAtRef.current,
      finishedAt: Date.now(),
      status: runStatus,
      tableData: resultRef.current,
      log: logRef.current
    }).catch((err) => {
      console.error(err);
    });
  };

  const processScraperResult = (data: ScraperResult) => {
    if (!data) {
      return;
    }
    switch (data.type) {
      case "extract":
        setResult((prev) => {
          const next = getRunnerTableData(data, prev);
          resultRef.current = next;
          return next;
        });
        break;
    }
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

    const { heading, message } = getRunnerHeaderInfo(operation);
    setHeading(heading);
    setMessage(message);
    appendLogEntry(heading, message, "info");

    window.scraper
      .runOperation(operation)
      .then((res) => {
        if (res.status === "success") {
          setStepsCompleted((prev) => prev + 1);
          processScraperResult(res.result);
          // Politeness delay between operations; the guard at the top of
          // executeNextOperation re-checks the status once the timer fires.
          if (operationDelayMs > 0) {
            setTimeout(executeNextOperation, operationDelayMs);
          } else {
            executeNextOperation();
          }
        } else {
          showError(res.message);
        }
      })
      .catch((err) => {
        console.error(err);
        showError("Something went wrong while running this step.");
      });
  };

  const start = () => {
    window.scraper.configure({ showWindow: showScraperWindow });
    statusRef.current = "started";
    generatorRef.current = getRunnerGenerator(script.operations);
    resultRef.current = null;
    logRef.current = [];
    // `start` is only ever invoked from click handlers, never during render,
    // so reading the clock here is safe.
    // eslint-disable-next-line react-hooks/purity
    startedAtRef.current = Date.now();
    persistedRef.current = false;
    setResult(null);
    setLog([]);
    setStepsCompleted(0);
    setElapsedMs(0);
    stopTimer();
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startedAtRef.current);
    }, 500);
    setStatus("started");
    setHeading("Running");
    setMessage("Working through the script steps…");
    executeNextOperation();
  };

  const stop = () => {
    stopTimer();
    statusRef.current = "stopped";
    setStatus("stopped");
    setHeading("Stopped");
    setMessage("Run stopped before it finished");
    appendLogEntry("Stopped", "Run stopped before it finished", "info");
    persistRun("stopped");
  };

  const finish = () => {
    stopTimer();
    statusRef.current = "stopped";
    setStatus("finished");
    setHeading("Finished");
    setMessage("All steps completed");
    appendLogEntry("Finished", "All steps completed", "success");
    persistRun("finished");
  };

  const showError = (error: string) => {
    stopTimer();
    window.scraper.closeWindow();
    statusRef.current = "stopped";
    setStatus("error");
    setHeading("Error");
    setMessage(error);
    appendLogEntry("Error", error, "error");
    persistRun("error");
  };

  return {
    status,
    heading,
    message,
    result,
    log,
    stepsCompleted,
    elapsedMs,
    start,
    stop
  };
};
