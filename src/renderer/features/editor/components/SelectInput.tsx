import type { SelectInputSchema } from "@common/types/operationSchema";
import { useId } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useEditorStore } from "../store/editorStore";

export default function SelectInput({
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
  schema: SelectInputSchema;
}) {
  const updateInput = useEditorStore((s) => s.actions.updateInput);
  const inputId = useId();

  const handleChange = (next: string) =>
    updateInput({ operationId, inputIndex, value: next });

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={inputId}>{schema.label}</Label>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger
          id={inputId}
          size="sm"
          className="w-full"
          aria-invalid={Boolean(error)}
        >
          <SelectValue placeholder={schema.label} />
        </SelectTrigger>
        <SelectContent>
          {schema.options.map((option) => (
            <SelectItem
              key={`${operationId}-${inputIndex}-${option.value}`}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
