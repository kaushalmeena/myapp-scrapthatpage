import EmptyState from "@/components/EmptyState";
import { Script } from "@/types/script";
import ScriptCard from "./ScriptCard";

type ScriptListProps = {
  scripts: Script[];
  onReload: () => void;
};

// Renders a list of scripts, or an empty-state placeholder when there are none.
// Shared by the screens that list scripts (Favorites, Search).
function ScriptList({ scripts, onReload }: ScriptListProps) {
  if (scripts.length === 0) {
    return <EmptyState message="No scripts found" />;
  }

  return (
    <div className="flex flex-col gap-2">
      {scripts.map((script) => (
        <ScriptCard
          key={`script-${script.id}`}
          script={script}
          onReload={onReload}
        />
      ))}
    </div>
  );
}

export default ScriptList;
