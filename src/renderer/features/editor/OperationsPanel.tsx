import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  getListIds,
  OperationListRef,
  reorderOperation,
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

  // A small activation distance keeps plain clicks (expand, buttons) from
  // starting a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleAddClick = () => dispatch(showOperationSelector(listRef));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      dispatch(
        reorderOperation({
          listRef,
          from: ids.indexOf(String(active.id)),
          to: ids.indexOf(String(over.id))
        })
      );
    }
  };

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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
              {ids.map((id, index) => (
                <OperationCard
                  key={id}
                  id={id}
                  listRef={listRef}
                  number={`${numberPrefix}${index + 1}`}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <EmptyState message="No operations added" />
        )}
      </div>
    </div>
  );
}

export default OperationsPanel;
