import { useId } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { type EditorSelectInput, updateInput } from "../scriptEditorSlice";

export default function OperationSelectInput({
  operationId,
  inputIndex,
  input
}: {
  operationId: string;
  inputIndex: number;
  input: EditorSelectInput;
}) {
  const dispatch = useAppDispatch();
  const inputId = useId();

  const handleChange = (value: string) =>
    dispatch(updateInput({ operationId, inputIndex, value }));

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={inputId}>{input.label}</Label>
      <Select value={input.value} onValueChange={handleChange}>
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
      {input.error && <p className="text-xs text-destructive">{input.error}</p>}
    </div>
  );
}
