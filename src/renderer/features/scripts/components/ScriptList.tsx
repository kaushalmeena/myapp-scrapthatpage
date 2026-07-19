import EmptyState from "@/components/EmptyState";
import type { Script } from "@/types/script";
import ScriptCard from "./ScriptCard";

// Renders a list of scripts, or an empty-state placeholder when there are none.
// Shared by the screens that list scripts (Favorites, Search). Lists refresh
// automatically via live queries, so no reload callback is needed.
export default function ScriptList({ scripts }: { scripts: Script[] }) {
  if (scripts.length === 0) {
    return <EmptyState message="No scripts found" />;
  }

  return (
    <div className="flex flex-col gap-2">
      {scripts.map((script) => (
        <ScriptCard key={`script-${script.id}`} script={script} />
      ))}
    </div>
  );
}
