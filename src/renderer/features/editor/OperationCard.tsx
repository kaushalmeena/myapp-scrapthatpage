import { ArrowDown, ArrowUp, Eye, EyeOff, X } from "lucide-react";
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
  moveOperation,
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
  index: number;
  // Display number like "2" or "2.3" (position within nested lists).
  number: string;
};

function OperationCard({ id, listRef, index, number }: OperationCardProps) {
  const dispatch = useAppDispatch();
  const operation = useAppSelector(
    (state) => state.scriptEditor.operations[id]
  );

  const [expanded, setExpanded] = useState(false);

  if (!operation) {
    return null;
  }

  const handleExpandToggle = () => setExpanded((prev) => !prev);

  const handleMoveUpClick = () =>
    dispatch(moveOperation({ listRef, index, direction: "up" }));

  const handleMoveDownClick = () =>
    dispatch(moveOperation({ listRef, index, direction: "down" }));

  const handleDeleteClick = () => dispatch(deleteOperation({ listRef, id }));

  const operationSubheader = replaceFormatWithInputs(
    operation.format,
    operation.inputs
  );

  return (
    <Card
      className={cn(
        "gap-0 py-0",
        !isOperationValid(operation) && "bg-destructive/10"
      )}
    >
      <div className="flex flex-row items-center gap-2 p-2">
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
            title="Move operation up"
            onClick={handleMoveUpClick}
          >
            <ArrowUp className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Move operation down"
            onClick={handleMoveDownClick}
          >
            <ArrowDown className="size-4" />
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
