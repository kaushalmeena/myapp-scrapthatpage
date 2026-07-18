import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "react-router";
import AsyncContent from "@/components/AsyncContent";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import db from "@/database";
import ResultTable from "@/features/runner/ResultTable";
import RunLog from "@/features/runner/RunLog";
import { cn } from "@/lib/utils";

function RunDetailScreen() {
  const params = useParams();

  const runId = Number(params.runId);

  // Distinguishes "still loading" (undefined) from "not found" (null), same
  // pattern as useScriptById.
  const run = useLiveQuery(
    async () => (await db.fetchRunById(runId)) ?? null,
    [runId]
  );

  return (
    <>
      <PageHeader title="Run detail" />
      <AsyncContent
        status={run === undefined ? "loading" : run ? "loaded" : "error"}
        error="Run not found."
      >
        {run && (
          <>
            <div className="mb-6 flex items-center gap-3">
              <p className="truncate font-medium">{run.scriptName}</p>
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
            {run.tableData && <ResultTable data={run.tableData} />}
            <div className="mt-6">
              <RunLog log={run.log} />
            </div>
          </>
        )}
      </AsyncContent>
    </>
  );
}

export default RunDetailScreen;
