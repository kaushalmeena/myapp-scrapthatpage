import { useRunnerStore } from "../store/runnerStore";
import RunnerStat from "./RunnerStat";

// "1:07"-style duration for the live stats strip.
const formatElapsed = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

// Isolated into its own component so the 500ms elapsed tick re-renders only
// this stat — not the runner card, result table or log.
export default function ElapsedStat() {
  const elapsedMs = useRunnerStore((s) => s.elapsedMs);
  return <RunnerStat label="elapsed" value={formatElapsed(elapsedMs)} />;
}
