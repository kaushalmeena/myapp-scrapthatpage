import { get } from "lodash";
import { CopyPlus } from "lucide-react";
import { ChangeEvent, useId } from "react";
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
import { LargeInput } from "../../../common/types/largeOperation";
import OperationsPanel from "./OperationsPanel";
import { showVariableSelector, updateInput } from "./scriptEditorSlice";

type OperationInputProps = {
  path: string;
};

function OperationInput({ path }: OperationInputProps) {
  const dispatch = useAppDispatch();
  const inputId = useId();
  const input = useAppSelector(
    (state) => get(state.scriptEditor, path) as LargeInput
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) =>
    dispatch(updateInput({ path, value: event.target.value }));

  const handleSelectChange = (value: string) =>
    dispatch(updateInput({ path, value }));

  const handlePickerOpen = () => dispatch(showVariableSelector(path));

  switch (input.type) {
    case "text":
      return (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={inputId}>{input.label}</Label>
          <div className="relative">
            <Input
              id={inputId}
              className={input.variablePicker ? "h-8 pr-8" : "h-8"}
              value={input.value}
              readOnly={input.inputProps?.readOnly}
              placeholder={input.inputProps?.placeholder}
              aria-invalid={Boolean(input.error)}
              onChange={handleInputChange}
            />
            {input.variablePicker && (
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
          </div>
          {input.error && (
            <p className="text-xs text-destructive">{input.error}</p>
          )}
        </div>
      );
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
                  key={`${path}-option-${option.value}`}
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
      return <OperationsPanel path={`${path}.operations`} />;
  }

  return null;
}

export default OperationInput;
