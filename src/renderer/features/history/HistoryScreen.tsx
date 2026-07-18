import { useLiveQuery } from "dexie-react-hooks";
import { CheckCircle2, CircleOff, Trash2, XCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import AsyncContent from "@/components/AsyncContent";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import db from "@/database";
import { Run } from "@/types/run";

function StatusIcon({ status }: { status: Run["status"] }) {
  switch (status) {
    case "finished":
      return <CheckCircle2 className="size-5 text-success" />;
    case "error":
      return <XCircle className="size-5 text-destructive" />;
    default:
      return <CircleOff className="size-5 text-muted-foreground" />;
  }
}

function HistoryScreen() {
  const navigate = useNavigate();

  const runs = useLiveQuery(() => db.fetchRecentRuns(), []);

  const handleDeleteClick = (run: Run) => {
    if (run.id === undefined) {
      return;
    }
    db.deleteRunById(run.id)
      .then(() => {
        toast.success("Run deleted");
      })
      .catch(() => {
        toast.error("Failed to delete run");
      });
  };

  const handleClearClick = () => {
    db.clearRuns()
      .then(() => {
        toast.success("History cleared");
      })
      .catch(() => {
        toast.error("Failed to clear history");
      });
  };

  return (
    <>
      <PageHeader title="History" />
      <div className="mb-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          disabled={!runs || runs.length === 0}
          onClick={handleClearClick}
        >
          Clear history
        </Button>
      </div>
      <AsyncContent status={runs === undefined ? "loading" : "loaded"} error="">
        {runs && runs.length === 0 ? (
          <EmptyState message="No runs yet — execute a script to see it here" />
        ) : (
          <div className="flex flex-col gap-2">
            {runs?.map((run) => {
              const duration = Math.round(
                (run.finishedAt - run.startedAt) / 1000
              );
              return (
                <Card key={run.id} className="flex-row items-center gap-3 p-3">
                  <StatusIcon status={run.status} />
                  <button
                    type="button"
                    className="min-w-0 flex-1 cursor-pointer rounded-md px-2 py-1 text-left transition-colors hover:bg-accent"
                    onClick={() => navigate(`/history/${run.id}`)}
                  >
                    <p className="truncate font-medium">{run.scriptName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(run.startedAt).toLocaleString()} · {duration}s ·{" "}
                      {run.tableData
                        ? `${run.tableData.rows.length} rows`
                        : "no data"}
                    </p>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Delete run"
                    onClick={() => handleDeleteClick(run)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </AsyncContent>
    </>
  );
}

export default HistoryScreen;
