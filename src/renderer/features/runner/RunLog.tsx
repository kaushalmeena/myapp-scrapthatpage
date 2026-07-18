import { cn } from "@/lib/utils";
import { RunLogEntry } from "@/types/run";

type RunLogProps = {
  log: RunLogEntry[];
};

function RunLog({ log }: RunLogProps) {
  if (log.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card">
      <p className="border-b p-3 text-sm font-semibold">Run log</p>
      <div className="flex max-h-64 flex-col gap-1 overflow-y-auto p-2">
        {log.map((entry, index) => (
          <div
            key={`entry-${index}-${entry.timestamp}`}
            className="flex items-baseline gap-2 rounded px-2 py-1 text-sm"
          >
            <span className="text-xs text-muted-foreground tabular-nums">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </span>
            <span
              className={cn(
                "min-w-16 font-medium",
                entry.status === "error" && "text-destructive",
                entry.status === "success" && "text-success"
              )}
            >
              {entry.heading}
            </span>
            <span
              className="truncate text-muted-foreground"
              title={entry.message}
            >
              {entry.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RunLog;
