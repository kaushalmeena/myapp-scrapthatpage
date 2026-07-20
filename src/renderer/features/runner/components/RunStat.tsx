// A single labeled figure in the runner's live stats strip (steps/rows/elapsed).
export default function RunStat({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-16 text-right">
      <p className="text-lg font-semibold tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
