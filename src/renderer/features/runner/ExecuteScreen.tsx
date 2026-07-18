import { useParams } from "react-router";
import AsyncContent from "@/components/AsyncContent";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { useScriptById } from "@/features/scripts/useScriptById";
import { cn } from "@/lib/utils";
import { Script } from "@/types/script";
import ActionButton from "./ActionButton";
import ResultTable from "./ResultTable";
import RunLog from "./RunLog";
import { getRunnerCardInfo } from "./runnerUtils";
import { useScriptRunner } from "./useScriptRunner";

type RunnerSectionProps = {
  script: Script;
};

// The runner hook lives here (rather than in ScriptRunner) so the screen can
// render the live run log alongside the runner card and result table.
function RunnerSection({ script }: RunnerSectionProps) {
  const { status, heading, message, result, log, start, stop } =
    useScriptRunner(script);

  const { title, color, tone, Icon } = getRunnerCardInfo(status);

  return (
    <>
      <Card
        className={cn(
          "flex-row items-center gap-4 p-4",
          tone === "success" && "bg-success/10",
          tone === "error" && "bg-destructive/10"
        )}
      >
        <ActionButton
          spinning={title === "Stop execution"}
          title={title}
          color={color}
          Icon={Icon}
          onClick={status === "started" ? stop : start}
        />
        <div>
          <p className="font-semibold">{heading}</p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </Card>
      {result && (
        <div className="mt-6">
          <ResultTable data={result} />
        </div>
      )}
      <div className="mt-6">
        <RunLog log={log} />
      </div>
    </>
  );
}

function ExecuteScreen() {
  const params = useParams();

  const script = useScriptById(Number(params.scriptId));

  return (
    <>
      <PageHeader title="Execute" />
      <AsyncContent
        status={script === undefined ? "loading" : script ? "loaded" : "error"}
        error="Script not found."
      >
        {script && (
          <>
            <p className="mb-6 text-center text-lg font-medium">
              {script.name}
            </p>
            <RunnerSection script={script} />
          </>
        )}
      </AsyncContent>
    </>
  );
}

export default ExecuteScreen;
