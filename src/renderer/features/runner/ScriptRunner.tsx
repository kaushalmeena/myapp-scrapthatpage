import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Script } from "@/types/script";
import ActionButton from "./ActionButton";
import ResultTable from "./ResultTable";
import { getRunnerCardInfo } from "./runnerUtils";
import { useScriptRunner } from "./useScriptRunner";

type ScriptRunnerProps = {
  script: Script;
};

function ScriptRunner({ script }: ScriptRunnerProps) {
  const { status, heading, message, result, start, stop } =
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
    </>
  );
}

export default ScriptRunner;
