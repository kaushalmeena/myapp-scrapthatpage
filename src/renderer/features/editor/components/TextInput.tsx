import type { TextInputSchema } from "@common/types/operationSchema";
import { CopyPlus, Crosshair } from "lucide-react";
import { type ChangeEvent, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { cn } from "@/lib/utils";
import {
  showElementPicker,
  showVariablePicker,
  updateInput
} from "../scriptEditorSlice";

export default function TextInput({
  operationId,
  inputIndex,
  value,
  error,
  schema
}: {
  operationId: string;
  inputIndex: number;
  value: string;
  error: string;
  schema: TextInputSchema;
}) {
  const dispatch = useAppDispatch();
  const inputId = useId();

  const hasVariablePicker = Boolean(schema.variablePicker);
  const hasElementPicker = Boolean(schema.elementPicker);
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
    dispatch(showVariablePicker({ operationId, inputIndex }));

  const handleElementPickerOpen = () =>
    dispatch(showElementPicker({ operationId, inputIndex }));

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={inputId}>{schema.label}</Label>
      <div className="relative">
        <Input
          id={inputId}
          className={cn("h-8", inputPadding)}
          value={value}
          readOnly={schema.inputProps?.readOnly}
          placeholder={schema.inputProps?.placeholder}
          type={schema.inputProps?.type}
          aria-invalid={Boolean(error)}
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
            onClick={handleElementPickerOpen}
          >
            <Crosshair className="size-4" />
          </Button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
