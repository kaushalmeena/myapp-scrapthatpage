import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, Copy, GripVertical, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { cn } from "@/lib/utils";
import {
  hasAnyInputValue,
  isOperationValid,
  replaceFormatWithInputs
} from "../../../../common/utils/operation";
import { OPERATION_ICONS } from "../constants/operationIcons";
import {
  deleteOperation,
  duplicateOperation,
  type OperationListRef
} from "../scriptEditorSlice";
import OperationInput from "./OperationInput";

const INPUT_WIDTH_CLASSES: Record<number, string> = {
  4: "col-span-12 md:col-span-4",
  6: "col-span-12 md:col-span-6",
  12: "col-span-12"
};

export default function OperationCard({
  id,
  listRef,
  number
}: {
  id: string;
  listRef: OperationListRef;
  // Display number like "2" or "2.3" (position within nested lists).
  number: string;
}) {
  const dispatch = useAppDispatch();
  const operation = useAppSelector((s) => s.scriptEditor.operations[id]);

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

  // Until the user fills something in, the format string is all placeholders;
  // show the step description instead so new steps stay self-explanatory.
  const operationSubheader = hasAnyInputValue(operation.inputs)
    ? replaceFormatWithInputs(operation.format, operation.inputs)
    : operation.description;

  const TypeIcon = OPERATION_ICONS[operation.type];
  const invalid = !isOperationValid(operation);

  return (
    <Card
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "gap-0 overflow-hidden py-0",
        invalid && "border-destructive/50 bg-destructive/5",
        isDragging && "relative z-10 opacity-60 shadow-lg"
      )}
    >
      <div className="flex flex-row items-stretch">
        <button
          type="button"
          title="Drag to reorder"
          className="flex shrink-0 cursor-grab touch-none items-center px-2 text-muted-foreground transition-colors hover:bg-accent active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        <button
          type="button"
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 py-2.5 pr-3 pl-1 text-left transition-colors hover:bg-accent"
          title={expanded ? "Hide step settings" : "Edit step settings"}
          onClick={handleExpandToggle}
        >
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-md",
              invalid
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/10 text-primary"
            )}
          >
            <TypeIcon className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="truncate text-sm font-medium">
                {operation.name}
              </span>
              <Badge
                variant="outline"
                className="px-1.5 py-0 text-[10px] text-muted-foreground"
              >
                {number}
              </Badge>
            </span>
            <span className="block truncate text-sm text-muted-foreground">
              {operationSubheader.trim() || operation.description}
            </span>
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-0.5 pr-2 pl-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            title="Duplicate step"
            onClick={handleDuplicateClick}
          >
            <Copy className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            title="Delete step"
            onClick={handleDeleteClick}
          >
            <X className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            title={expanded ? "Hide step settings" : "Edit step settings"}
            onClick={handleExpandToggle}
          >
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                expanded && "rotate-180"
              )}
            />
          </Button>
        </div>
      </div>
      {/* Height auto-animation so the settings section slides open/closed
          instead of snapping. initial={false} skips the animation on mount. */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="step-settings"
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
