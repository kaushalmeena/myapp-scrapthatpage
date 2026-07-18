import { get } from "lodash";
import { ArrowDown, ArrowUp, Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { cn } from "@/lib/utils";
import { LargeOperation } from "../../../common/types/largeOperation";
import {
  isOperationValid,
  replaceFormatWithInputs
} from "../../../common/utils/operation";
import { getOperationNumber } from "./editorUtils";
import OperationInput from "./OperationInput";
import {
  deleteOperation,
  moveDownOperation,
  moveUpOperation
} from "./scriptEditorSlice";

const INPUT_WIDTH_CLASSES: Record<number, string> = {
  4: "col-span-12 md:col-span-4",
  6: "col-span-12 md:col-span-6",
  12: "col-span-12"
};

type OperationCardProps = {
  path: string;
};

function OperationCard({ path }: OperationCardProps) {
  const dispatch = useAppDispatch();
  const operation = useAppSelector(
    (state) => get(state.scriptEditor, path) as LargeOperation
  );

  const [expanded, setExpanded] = useState(false);

  const handleExpandToggle = () => setExpanded((prev) => !prev);

  const handleMoveUpClick = () => dispatch(moveUpOperation(path));

  const handleMoveDownClick = () => dispatch(moveDownOperation(path));

  const handleDeleteClick = () => dispatch(deleteOperation(path));

  const operationNumber = getOperationNumber(path);
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
          <Badge variant="outline">{operationNumber}</Badge>
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
            {operation.inputs.map((input, index) => (
              <div
                key={`${path}.inputs.${index}`}
                className={
                  INPUT_WIDTH_CLASSES["width" in input ? input.width : 12]
                }
              >
                <OperationInput path={`${path}.inputs.${index}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export default OperationCard;
