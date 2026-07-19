import { CopyPlus, Crosshair } from "lucide-react";
import { type ChangeEvent, useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { cn } from "@/lib/utils";
import OperationsPanel from "./OperationsPanel";
import { showVariableSelector, updateInput } from "./scriptEditorSlice";

export default function OperationInput({
  operationId,
  inputIndex,
  numberPrefix
}: {
  operationId: string;
  inputIndex: number;
  // Number prefix for nested operation lists rendered by box inputs.
  numberPrefix: string;
}) {
  const dispatch = useAppDispatch();
  const inputId = useId();
  const input = useAppSelector(
    (s) => s.scriptEditor.operations[operationId]?.inputs[inputIndex]
  );

  const [picking, setPicking] = useState(false);

  if (!input) {
    return null;
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) =>
    dispatch(
      updateInput({ operationId, inputIndex, value: event.target.value })
    );

  const handleSelectChange = (value: string) =>
    dispatch(updateInput({ operationId, inputIndex, value }));

  const handlePickerOpen = () =>
    dispatch(showVariableSelector({ operationId, inputIndex }));

  const handleElementPick = async () => {
    setPicking(true);
    try {
      const res = await window.scraper.pickElement();
      if (res.status === "success") {
        dispatch(updateInput({ operationId, inputIndex, value: res.selector }));
        toast.success("Element picked");
      } else {
        toast.error(res.message);
      }
    } finally {
      setPicking(false);
    }
  };

  switch (input.type) {
    case "text": {
      const hasVariablePicker = Boolean(input.variablePicker);
      const hasElementPicker = Boolean(input.elementPicker);
      const inputPadding =
        hasVariablePicker && hasElementPicker
          ? "pr-14"
          : hasVariablePicker || hasElementPicker
            ? "pr-8"
            : "";
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
              onChange={handleInputChange}
            />
            {hasVariablePicker && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                title="Show variable picker"
                className="absolute top-1 right-1"
                onClick={handlePickerOpen}
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
                disabled={picking}
                onClick={handleElementPick}
              >
                <Crosshair className="size-4" />
              </Button>
            )}
          </div>
          {input.error && (
            <p className="text-xs text-destructive">{input.error}</p>
          )}
        </div>
      );
    }
    case "select":
      return (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={inputId}>{input.label}</Label>
          <Select value={input.value} onValueChange={handleSelectChange}>
            <SelectTrigger
              id={inputId}
              size="sm"
              className="w-full"
              aria-invalid={Boolean(input.error)}
            >
              <SelectValue placeholder={input.label} />
            </SelectTrigger>
            <SelectContent>
              {input.options.map((option) => (
                <SelectItem
                  key={`${operationId}-${inputIndex}-${option.value}`}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {input.error && (
            <p className="text-xs text-destructive">{input.error}</p>
          )}
        </div>
      );
    case "operation_box":
      return (
        <OperationsPanel
          listRef={{ parentId: operationId, inputIndex }}
          numberPrefix={numberPrefix}
        />
      );
  }
}
