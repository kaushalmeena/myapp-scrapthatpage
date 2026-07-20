import { useCallback, useRef, useState } from "react";
import type { RunLogEntry } from "@/types/run";

// Accumulates the live run log. The entries are mirrored into a ref because the
// async operation callbacks that append them capture stale state, and the ref
// is what gets persisted with the run.
export const useRunLog = () => {
  const [log, setLog] = useState<RunLogEntry[]>([]);
  const logRef = useRef<RunLogEntry[]>([]);

  const append = useCallback(
    (heading: string, message: string, status: RunLogEntry["status"]) => {
      const entry: RunLogEntry = {
        timestamp: Date.now(),
        heading,
        message,
        status
      };
      logRef.current = [...logRef.current, entry];
      setLog(logRef.current);
    },
    []
  );

  const reset = useCallback(() => {
    logRef.current = [];
    setLog([]);
  }, []);

  const getEntries = useCallback(() => logRef.current, []);

  return { log, append, reset, getEntries };
};
