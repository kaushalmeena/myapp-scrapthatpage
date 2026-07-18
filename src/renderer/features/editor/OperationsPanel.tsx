import { get } from "lodash";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { LargeOperation } from "../../../common/types/largeOperation";
import OperationCard from "./OperationCard";
import { showOperationSelector } from "./scriptEditorSlice";

type OperationsPanelProps = {
  path: string;
};

function OperationsPanel({ path }: OperationsPanelProps) {
  const dispatch = useAppDispatch();
  const operations = useAppSelector(
    (state) => get(state.scriptEditor, path) as LargeOperation[],
    (prevOperations, nextOperations) =>
      prevOperations.length === nextOperations.length
  );

  const handleAddClick = () => dispatch(showOperationSelector(path));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          title="Add operation"
          onClick={handleAddClick}
        >
          <Plus className="size-4" />
          Add
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {operations.length > 0 ? (
          operations.map((_, index) => (
            <OperationCard key={`${path}.${index}`} path={`${path}.${index}`} />
          ))
        ) : (
          <EmptyState message="No operations added" />
        )}
      </div>
    </div>
  );
}

export default OperationsPanel;
