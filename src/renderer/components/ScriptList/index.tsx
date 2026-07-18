import { Stack } from "@mui/material";
import { Script } from "../../types/script";
import EmptyText from "../EmptyText";
import ScriptCard from "../ScriptCard";

type ScriptListProps = {
  scripts: Script[];
  onReload: () => void;
};

// Renders a list of scripts, or an empty-state placeholder when there are none.
// Shared by the screens that list scripts (Favorites, Search).
function ScriptList({ scripts, onReload }: ScriptListProps) {
  if (scripts.length === 0) {
    return <EmptyText />;
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {scripts.map((script) => (
        <ScriptCard
          key={`script-${script.id}`}
          script={script}
          onReload={onReload}
        />
      ))}
    </Stack>
  );
}

export default ScriptList;
