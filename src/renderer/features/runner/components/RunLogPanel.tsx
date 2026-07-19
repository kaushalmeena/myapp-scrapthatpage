import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { RunLogEntry } from "@/types/run";

export default function RunLogPanel({ data }: { data: RunLogEntry[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Follow the newest entry while a run appends to the log. The entry count is
  // the intended trigger — the body only touches the ref.
  // biome-ignore lint/correctness/useExhaustiveDependencies: log.length is the deliberate trigger
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [data.length]);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="allow-select overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-2.5">
        <h2 className="text-sm font-semibold">Run log</h2>
        <span className="text-xs text-muted-foreground">
          {data.length} {data.length === 1 ? "event" : "events"}
        </span>
      </div>
      <div
        ref={scrollRef}
        className="flex max-h-64 flex-col overflow-y-auto p-2"
      >
        {data.map((entry, index) => (
          <div
            key={`entry-${index}-${entry.timestamp}`}
            className="flex items-baseline gap-2.5 rounded px-2 py-1 text-sm"
          >
            <span
              className={cn(
                "size-1.5 shrink-0 -translate-y-px rounded-full",
                entry.status === "error" && "bg-destructive",
                entry.status === "success" && "bg-success",
                entry.status === "info" && "bg-muted-foreground/40"
              )}
            />
            <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </span>
            <span
              className={cn(
                "shrink-0 font-medium",
                entry.status === "error" && "text-destructive",
                entry.status === "success" && "text-success"
              )}
            >
              {entry.heading}
            </span>
            <span
              className="truncate font-mono text-xs text-muted-foreground"
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
