import { useParams } from "react-router";
import AsyncContent from "@/components/AsyncContent";
import FadeIn from "@/components/FadeIn";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { useScriptById } from "@/features/scripts/hooks/useScriptById";
import { cn } from "@/lib/utils";
import type { Script } from "@/types/script";
import ActionButton from "./components/ActionButton";
import ResultTable from "./components/ResultTable";
import RunLogPanel from "./components/RunLogPanel";
import StepsPreview from "./components/StepsPreview";
import { useScriptRunner } from "./hooks/useScriptRunner";
import { getRunnerCardInfo } from "./utils/runnerUtils";

// "1:07"-style duration for the live stats strip.
const formatElapsed = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

function RunStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-16 text-right">
      <p className="text-lg font-semibold tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

// The runner hook lives here (rather than in ScriptRunner) so the screen can
// render the live run log alongside the runner card and result table.
function RunnerSection({ script }: { script: Script }) {
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

export default function ExecuteScreen() {
  const params = useParams();

  const script = useScriptById(Number(params.scriptId));

  return (
    <>
      <PageHeader
        back
        title="Run script"
        subtitle={script ? script.name : undefined}
      />
      <AsyncContent
        status={script === undefined ? "loading" : script ? "loaded" : "error"}
        error="Script not found."
      >
        {script && <RunnerSection script={script} />}
      </AsyncContent>
    </>
  );
}
