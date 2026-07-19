import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "react-router";
import AsyncContent from "@/components/AsyncContent";
import FadeIn from "@/components/FadeIn";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import db from "@/database";
import ResultTable from "@/features/runner/components/ResultTable";
import RunLogPanel from "@/features/runner/components/RunLogPanel";
import { cn } from "@/lib/utils";

export default function LogsScreen() {
  const params = useParams();

  const runId = Number(params.runId);

  // Distinguishes "still loading" (undefined) from "not found" (null), same
  // pattern as useScriptById.
  const run = useLiveQuery(async () => db.getRunById(runId) ?? null, [runId]);

  return (
    <>
      <PageHeader
        back
        title="Run details"
        subtitle={run ? run.scriptName : undefined}
      />
      <AsyncContent
        status={run === undefined ? "loading" : run ? "loaded" : "error"}
        error="Run not found."
      >
        {run && (
          <>
            <div className="mb-6 flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                {new Date(run.startedAt).toLocaleString()}
              </p>
              <Badge
                variant="secondary"
                className={cn(
                  run.status === "error" && "bg-destructive/10 text-destructive"
                )}
              >
                {run.status}
              </Badge>
            </div>
            {run.tableData && (
              <FadeIn>
                <ResultTable data={run.tableData} />
              </FadeIn>
            )}
            <FadeIn className="mt-6" delay={0.05}>
              <RunLogPanel data={run.log} />
            </FadeIn>
          </>
        )}
      </AsyncContent>
    </>
  );
}
