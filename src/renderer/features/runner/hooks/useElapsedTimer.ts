import { useCallback, useEffect, useRef, useState } from "react";

// Tracks wall-clock elapsed time for a run, ticking a display value every
// 500ms while active. Encapsulates the start timestamp and interval so the
// runner hook doesn't juggle timer refs directly.
export const useElapsedTimer = () => {
  const [elapsedMs, setElapsedMs] = useState(0);
  const startedAtRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined
  );

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
    if (startedAtRef.current > 0) {
      setElapsedMs(Date.now() - startedAtRef.current);
    }
  }, []);

  const start = useCallback(() => {
    startedAtRef.current = Date.now();
    setElapsedMs(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startedAtRef.current);
    }, 500);
  }, []);

  // Clear the ticker if the screen unmounts mid-run.
  useEffect(() => stop, [stop]);

  // The run's start timestamp, for stamping the persisted run record.
  const getStartedAt = useCallback(() => startedAtRef.current, []);

  return { elapsedMs, start, stop, getStartedAt };
};
