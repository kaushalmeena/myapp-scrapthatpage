import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  getListIds,
  OperationListRef,
  showOperationSelector
} from "./scriptEditorSlice";
import OperationCard from "./OperationCard";

type OperationsPanelProps = {
  listRef: OperationListRef;
  // Display-number prefix for this list ("" at the root, "2.1." inside the
  // first box of the second operation, and so on).
  numberPrefix: string;
};

function OperationsPanel({ listRef, numberPrefix }: OperationsPanelProps) {
  const dispatch = useAppDispatch();
  // Immer keeps untouched arrays referentially stable, so the default
  // reference equality only re-renders this list when it actually changes.
  const ids = useAppSelector((state) =>
    getListIds(state.scriptEditor, listRef)
  );

  const handleAddClick = () => dispatch(showOperationSelector(listRef));

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
        {ids.length > 0 ? (
          ids.map((id, index) => (
            <OperationCard
              key={id}
              id={id}
              listRef={listRef}
              index={index}
              number={`${numberPrefix}${index + 1}`}
            />
          ))
        ) : (
          <EmptyState message="No operations added" />
        )}
      </div>
    </div>
  );
}

export default OperationsPanel;
