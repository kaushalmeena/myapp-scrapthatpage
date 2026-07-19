import {
  closestCenter,
  DndContext,
  type DragEndEvent,
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
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  getOperationIds,
  type OperationListRef,
  reorderOperation,
  showOperationPicker
} from "../scriptEditorSlice";
import OperationCard from "./OperationCard";

export default function OperationsPanel({
  listRef,
  numberPrefix
}: {
  listRef: OperationListRef;
  // Display-number prefix for this list ("" at the root, "2.1." inside the
  // first box of the second operation, and so on).
  numberPrefix: string;
}) {
  const dispatch = useAppDispatch();
  // Immer keeps untouched arrays referentially stable, so the default
  // reference equality only re-renders this list when it actually changes.
  const ids = useAppSelector((state) =>
    getOperationIds(state.scriptEditor, listRef)
  );

  // A small activation distance keeps plain clicks (expand, buttons) from
  // starting a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleAddClick = () => dispatch(showOperationPicker(listRef));

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

  const isRootList = listRef.parentId === null;

  return (
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
        isRootList && (
          <div className="rounded-lg border border-dashed px-4 py-6 text-center">
            <p className="text-sm font-medium">No steps yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Most scripts start with “Open page” to load the site you want to
              scrape.
            </p>
          </div>
        )
      )}
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-center gap-2 border-dashed text-muted-foreground hover:text-foreground"
        title="Add a step"
        onClick={handleAddClick}
      >
        <Plus className="size-4" />
        Add step
      </Button>
    </div>
  );
}
