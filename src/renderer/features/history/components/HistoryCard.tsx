import { CheckCircle2, CircleOff, Trash2, XCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import db from "@/database";
import { TOAST_MESSAGES } from "@/lib/messages";
import type { Run } from "@/types/run";

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

export default function HistoryCard({ run }: { run: Run }) {
  const navigate = useNavigate();

  const durationSeconds = Math.round((run.finishedAt - run.startedAt) / 1000);

  const handleOpenClick = () => navigate(`/history/${run.id}`);

  const handleDeleteClick = () => {
    if (run.id === undefined) return;
    db.deleteRun(run.id)
      .then(() => {
        toast.success(TOAST_MESSAGES.RUN_DELETE_SUCCESS);
      })
      .catch(() => {
        toast.error(TOAST_MESSAGES.RUN_DELETE_FAILURE);
      });
  };

  return (
    <Card className="flex flex-row items-stretch gap-0 overflow-hidden p-0">
      <button
        type="button"
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent"
        onClick={handleOpenClick}
      >
        <StatusIcon status={run.status} />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">{run.scriptName}</span>
          <span className="block truncate text-sm text-muted-foreground">
            {new Date(run.startedAt).toLocaleString()} · {durationSeconds}s ·{" "}
            {run.tableData ? `${run.tableData.rows.length} rows` : "no data"}
          </span>
        </span>
      </button>
      <div className="flex shrink-0 items-center pr-2 pl-1">
        <Button
          variant="ghost"
          size="icon"
          title="Delete run"
          onClick={handleDeleteClick}
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>
    </Card>
  );
}
