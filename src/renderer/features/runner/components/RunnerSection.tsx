import FadeIn from "@/components/FadeIn";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Script } from "@/types/script";
import { useScriptRunner } from "../hooks/useScriptRunner";
import { getRunnerCardInfo } from "../utils/runnerUtils";
import ActionButton from "./ActionButton";
import ResultTable from "./ResultTable";
import RunLogPanel from "./RunLogPanel";
import RunStat from "./RunStat";
import StepsPreview from "./StepsPreview";

// "1:07"-style duration for the live stats strip.
const formatElapsed = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

// Drives a run and renders the runner card, live stats, steps preview, result
// table and run log. Owns the runner hook so the whole run UI updates together.
export default function RunnerSection({ script }: { script: Script }) {
  const {
    status,
    heading,
    message,
    result,
    log,
    stepsCompleted,
    elapsedMs,
    start,
    stop
  } = useScriptRunner(script);

  const { title, color, tone, Icon } = getRunnerCardInfo(status);

  const running = status === "started";
  const hasRun = status !== "ready";

  return (
    <div className="flex flex-col gap-4">
      <Card
        className={cn(
          "flex-row items-center gap-4 p-4",
          running && "border-primary/30 bg-primary/5",
          tone === "success" && "border-success/30 bg-success/10",
          tone === "error" && "border-destructive/30 bg-destructive/10"
        )}
      >
        <ActionButton
          spinning={running}
          title={title}
          color={color}
          Icon={Icon}
          onClick={running ? stop : start}
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{heading}</p>
          <p className="truncate text-sm text-muted-foreground" title={message}>
            {message}
          </p>
        </div>
        {hasRun && (
          <div className="flex shrink-0 items-center gap-6 pr-2">
            <RunStat label="steps run" value={String(stepsCompleted)} />
            <RunStat
              label="rows"
              value={String(result ? result.rows.length : 0)}
            />
            <RunStat label="elapsed" value={formatElapsed(elapsedMs)} />
          </div>
        )}
      </Card>

      {!hasRun && script.operations.length > 0 && (
        <StepsPreview operations={script.operations} />
      )}

      {result && (
        <FadeIn>
          <ResultTable data={result} />
        </FadeIn>
      )}
      {log.length > 0 && (
        <FadeIn delay={0.05}>
          <RunLogPanel data={log} />
        </FadeIn>
      )}
    </div>
  );
}
