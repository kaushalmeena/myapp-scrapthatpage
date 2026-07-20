import type { ScraperResult } from "@common/types/scraper";
import { create } from "zustand";
import db from "@/database";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import type { Run, RunLogEntry } from "@/types/run";
import type { Script } from "@/types/script";
import type { RunnerGenerator, RunnerStatus, TableData } from "../types";
import {
  createRunnerGenerator,
  getRunnerHeaderInfo,
  getRunnerTableData
} from "../utils/runnerUtils";

type RunnerState = {
  status: RunnerStatus;
  heading: string;
  message: string;
  result: TableData | null;
  log: RunLogEntry[];
  // Steps executed so far in the current/last run.
  stepsCompleted: number;
  // Wall-clock duration, ticking while a run is in progress.
  elapsedMs: number;
};

type RunnerActions = {
  start: (script: Script) => void;
  stop: () => void;
  // Resets to the idle "ready" state (used when opening the run screen fresh).
  reset: () => void;
};

const READY: RunnerState = {
  status: "ready",
  heading: "Ready",
  message: "Press play to run this script",
  result: null,
  log: [],
  stepsCompleted: 0,
  elapsedMs: 0
};

/**
 * Transient (non-persisted) store for a single script run. The engine below
 * (start/stop + the executeNext loop) lives here rather than in a hook: it's a
 * long-lived imperative state machine, so using get()/set() as the single
 * source of truth avoids the stale-closure refs a hook would need. Components
 * subscribe to just the slice they render (e.g. only ElapsedStat watches
 * `elapsedMs`), so the 500ms tick never re-renders the result table.
 */
export const useRunnerStore = create<RunnerState & RunnerActions>(() => ({
  ...READY,
  start: (script) => startRun(script),
  stop: () => endRun(STOPPED),
  reset: () => {
    if (useRunnerStore.getState().status === "started") {
      return;
    }
    stopTimer();
    generator = undefined;
    persisted = false;
    useRunnerStore.setState(READY);
  }
}));

const set = (partial: Partial<RunnerState>) => useRunnerStore.setState(partial);
const get = () => useRunnerStore.getState();

// Per-run internals kept off the reactive state (a single run at a time).
let generator: RunnerGenerator | undefined;
let timer: ReturnType<typeof setInterval> | undefined;
let startedAt = 0;
let persisted = false;
let runningScript: Script | undefined;

const stopTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
  if (startedAt > 0) {
    set({ elapsedMs: Date.now() - startedAt });
  }
};

const appendLog = (
  heading: string,
  message: string,
  status: RunLogEntry["status"]
) => {
  const entry: RunLogEntry = {
    timestamp: Date.now(),
    heading,
    message,
    status
  };
  set({ log: [...get().log, entry] });
};

const persistRun = (runStatus: Run["status"]) => {
  if (persisted || !runningScript) {
    return;
  }
  persisted = true;
  db.createRun({
    scriptId: runningScript.id,
    scriptName: runningScript.name,
    startedAt,
    finishedAt: Date.now(),
    status: runStatus,
    result: get().result,
    log: get().log
  }).catch((err) => {
    console.error(err);
  });
};

// Terminal transitions: freeze the display, log the outcome, persist the run.
type Outcome = {
  status: RunnerStatus;
  heading: string;
  message: string;
  logStatus: RunLogEntry["status"];
  runStatus: Run["status"];
};

const FINISHED: Outcome = {
  status: "finished",
  heading: "Finished",
  message: "All steps completed",
  logStatus: "success",
  runStatus: "finished"
};

const STOPPED: Outcome = {
  status: "stopped",
  heading: "Stopped",
  message: "Run stopped before it finished",
  logStatus: "info",
  runStatus: "stopped"
};

const endRun = (outcome: Outcome) => {
  stopTimer();
  set({
    status: outcome.status,
    heading: outcome.heading,
    message: outcome.message
  });
  appendLog(outcome.heading, outcome.message, outcome.logStatus);
  persistRun(outcome.runStatus);
};

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

const processResult = (data: ScraperResult) => {
  if (data?.type === "extract") {
    set({ result: getRunnerTableData(data, get().result) });
  }
};

const executeNext = () => {
  if (get().status !== "started") {
    return;
  }

  const operationData = generator?.next();
  if (!operationData) {
    return;
  }

  if (operationData.done) {
    endRun(FINISHED);
    window.scraper.closeWindow();
    return;
  }

  const operation = operationData.value;
  if (!operation) {
    showError("This script has no steps to run.");
    return;
  }

  const info = getRunnerHeaderInfo(operation);
  set({ heading: info.heading, message: info.message });
  appendLog(info.heading, info.message, "info");

  window.scraper
    .runOperation(operation)
    .then((res) => {
      if (res.status !== "success") {
        showError(res.message);
        return;
      }
      set({ stepsCompleted: get().stepsCompleted + 1 });
      processResult(res.result);
      // Politeness delay between steps; the guard at the top of executeNext
      // re-checks the status once the timer fires (so stop() interrupts it).
      const { stepDelayMs } = useSettingsStore.getState();
      if (stepDelayMs > 0) {
        setTimeout(executeNext, stepDelayMs);
      } else {
        executeNext();
      }
    })
    .catch((err) => {
      console.error(err);
      showError("Something went wrong while running this step.");
    });
};

const startRun = (script: Script) => {
  const { showWindow } = useSettingsStore.getState();
  window.scraper.configure({ showWindow });

  runningScript = script;
  generator = createRunnerGenerator(script.operations);
  persisted = false;
  startedAt = Date.now();

  set({
    ...READY,
    status: "started",
    heading: "Running",
    message: "Working through the script steps…"
  });

  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(() => set({ elapsedMs: Date.now() - startedAt }), 500);

  executeNext();
};
