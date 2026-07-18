import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, Eye, EyeOff, GripVertical, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { cn } from "@/lib/utils";
import {
  isOperationValid,
  replaceFormatWithInputs
} from "../../../common/utils/operation";
import OperationInput from "./OperationInput";
import {
  deleteOperation,
  duplicateOperation,
  OperationListRef
} from "./scriptEditorSlice";

const INPUT_WIDTH_CLASSES: Record<number, string> = {
  4: "col-span-12 md:col-span-4",
  6: "col-span-12 md:col-span-6",
  12: "col-span-12"
};

type OperationCardProps = {
  id: string;
  listRef: OperationListRef;
  // Display number like "2" or "2.3" (position within nested lists).
  number: string;
};

function OperationCard({ id, listRef, number }: OperationCardProps) {
  const dispatch = useAppDispatch();
  const operation = useAppSelector(
    (state) => state.scriptEditor.operations[id]
  );

  const [expanded, setExpanded] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  if (!operation) {
    return null;
  }

  const handleExpandToggle = () => setExpanded((prev) => !prev);

  const handleDuplicateClick = () =>
    dispatch(duplicateOperation({ listRef, id }));

  const handleDeleteClick = () => dispatch(deleteOperation({ listRef, id }));

  const operationSubheader = replaceFormatWithInputs(
    operation.format,
    operation.inputs
  );

  return (
    <Card
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "gap-0 py-0",
        !isOperationValid(operation) && "bg-destructive/10",
        isDragging && "relative z-10 opacity-60 shadow-lg"
      )}
    >
      <div className="flex flex-row items-center gap-1 p-2">
        <button
          type="button"
          title="Drag to reorder"
          className="cursor-grab touch-none rounded-md p-1.5 text-muted-foreground hover:bg-accent active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        <button
          type="button"
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-accent"
          onClick={handleExpandToggle}
        >
          <Badge variant="outline">{number}</Badge>
          <span className="min-w-0">
            <span className="block truncate font-medium">{operation.name}</span>
            <span className="block truncate text-sm text-muted-foreground">
              {operationSubheader}
            </span>
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            title="Duplicate operation"
            onClick={handleDuplicateClick}
          >
            <Copy className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title={expanded ? "Hide operation inputs" : "Show operation inputs"}
            onClick={handleExpandToggle}
          >
            {expanded ? (
              <Eye className="size-4 text-primary" />
            ) : (
              <EyeOff className="size-4 text-primary" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Delete operation"
            onClick={handleDeleteClick}
          >
            <X className="size-4 text-destructive" />
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="border-t p-4">
          <div className="grid grid-cols-12 gap-3">
            {operation.inputs.map((input, inputIndex) => (
              <div
                key={`${id}-input-${inputIndex}`}
                className={
                  INPUT_WIDTH_CLASSES["width" in input ? input.width : 12]
                }
              >
                <OperationInput
                  operationId={id}
                  inputIndex={inputIndex}
                  numberPrefix={`${number}.`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export default OperationCard;
