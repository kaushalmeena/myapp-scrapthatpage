import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";
import AsyncContent from "@/components/AsyncContent";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import db from "@/database";
import { TOAST_MESSAGES } from "@/lib/messages";
import HistoryCard from "./components/HistoryCard";

export default function HistoryScreen() {
  const runs = useLiveQuery(() => db.getRecentRuns(), []);

  const handleClearClick = () => {
    db.clearRuns()
      .then(() => {
        toast.success(TOAST_MESSAGES.RUNS_CLEAR_SUCCESS);
      })
      .catch(() => {
        toast.error(TOAST_MESSAGES.RUNS_CLEAR_FAILURE);
      });
  };

  return (
    <>
      <PageHeader
        title="History"
        subtitle="Recent script runs and their results"
        actions={
          <Button
            variant="outline"
            size="sm"
            disabled={!runs || runs.length === 0}
            onClick={handleClearClick}
          >
            Clear history
          </Button>
        }
      />
      <AsyncContent status={runs === undefined ? "loading" : "loaded"}>
        {runs && runs.length === 0 ? (
          <EmptyState message="No runs yet — results will appear here after you run a script" />
        ) : (
          <div className="flex flex-col gap-2">
            {runs?.map((run) => (
              <HistoryCard key={run.id} run={run} />
            ))}
          </div>
        )}
      </AsyncContent>
    </>
  );
}
