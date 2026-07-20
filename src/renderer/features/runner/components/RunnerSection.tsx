import { useEffect } from "react";
import FadeIn from "@/components/FadeIn";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Script } from "@/types/script";
import { useRunnerStore } from "../store/runnerStore";
import { getRunnerCardInfo } from "../utils/runnerUtils";
import ActionButton from "./ActionButton";
import ElapsedStat from "./ElapsedStat";
import ResultTable from "./ResultTable";
import RunLogPanel from "./RunLogPanel";
import RunnerStat from "./RunnerStat";
import StepsPreview from "./StepsPreview";

// Renders the runner card, live stats, steps preview, result table and run log.
// Subscribes to the runner store per-slice; elapsed time is isolated in
// ElapsedStat so its 500ms tick doesn't re-render the rest.
export default function RunnerSection({ script }: { script: Script }) {
  const status = useRunnerStore((s) => s.status);
  const heading = useRunnerStore((s) => s.heading);
  const message = useRunnerStore((s) => s.message);
  const result = useRunnerStore((s) => s.result);
  const log = useRunnerStore((s) => s.log);
  const stepsCompleted = useRunnerStore((s) => s.stepsCompleted);
  const start = useRunnerStore((s) => s.start);
  const stop = useRunnerStore((s) => s.stop);
  const reset = useRunnerStore((s) => s.reset);

  // Fresh "ready" state when opening a script's run screen (no-op mid-run).
  // Depends on script.id so switching scripts (same route, no remount) resets.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on script switch is intentional
  useEffect(() => {
    reset();
  }, [reset, script.id]);

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
          onClick={running ? stop : () => start(script)}
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{heading}</p>
          <p className="truncate text-sm text-muted-foreground" title={message}>
            {message}
          </p>
        </div>
        {hasRun && (
          <div className="flex shrink-0 items-center gap-6 pr-2">
            <RunnerStat label="steps run" value={String(stepsCompleted)} />
            <RunnerStat
              label="rows"
              value={String(result ? result.rows.length : 0)}
            />
            <ElapsedStat />
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
