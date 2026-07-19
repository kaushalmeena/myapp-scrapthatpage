import { CopyPlus, Crosshair } from "lucide-react";
import { type ChangeEvent, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { cn } from "@/lib/utils";
import {
  type EditorTextInput,
  showVariableSelector,
  updateInput
} from "../scriptEditorSlice";
import ElementPickerDialog from "./ElementPickerDialog";

export default function OperationTextInput({
  operationId,
  inputIndex,
  input
}: {
  operationId: string;
  inputIndex: number;
  input: EditorTextInput;
}) {
  const dispatch = useAppDispatch();
  const inputId = useId();
  const [pickerOpen, setPickerOpen] = useState(false);

  const hasVariablePicker = Boolean(input.variablePicker);
  const hasElementPicker = Boolean(input.elementPicker);
  const inputPadding =
    hasVariablePicker && hasElementPicker
      ? "pr-14"
      : hasVariablePicker || hasElementPicker
        ? "pr-8"
        : "";

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    dispatch(
      updateInput({ operationId, inputIndex, value: event.target.value })
    );

  const handleVariablePickerOpen = () =>
    dispatch(showVariableSelector({ operationId, inputIndex }));

  const handlePicked = (selector: string) =>
    dispatch(updateInput({ operationId, inputIndex, value: selector }));

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={inputId}>{input.label}</Label>
      <div className="relative">
        <Input
          id={inputId}
          className={cn("h-8", inputPadding)}
          value={input.value}
          readOnly={input.inputProps?.readOnly}
          placeholder={input.inputProps?.placeholder}
          type={input.inputProps?.type}
          aria-invalid={Boolean(input.error)}
          onChange={handleChange}
        />
        {hasVariablePicker && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            title="Show variable picker"
            className="absolute top-1 right-1"
            onClick={handleVariablePickerOpen}
          >
            <CopyPlus className="size-4" />
          </Button>
        )}
        {hasElementPicker && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            title="Pick element from page"
            className={cn(
              "absolute top-1",
              hasVariablePicker ? "right-8" : "right-1"
            )}
            onClick={() => setPickerOpen(true)}
          >
            <Crosshair className="size-4" />
          </Button>
        )}
      </div>
      {input.error && <p className="text-xs text-destructive">{input.error}</p>}
      {hasElementPicker && (
        <ElementPickerDialog
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          onPicked={handlePicked}
        />
      )}
    </div>
  );
}
