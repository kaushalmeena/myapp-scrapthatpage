import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { FORM_OPERATIONS } from "../../../../common/constants/formOperations";
import type { FormOperation } from "../../../../common/types/formOperation";
import { OPERATION_ICONS } from "../constants/operationIcons";
import {
  appendOperation,
  hideOperationPicker,
  selectOperationPicker
} from "../scriptEditorSlice";

// Searchable step picker (same command-palette interaction as Cmd+K):
// type to filter, Enter or click to add the step.
export default function OperationPickerDialog() {
  const dispatch = useAppDispatch();
  const selector = useAppSelector(selectOperationPicker);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dispatch(hideOperationPicker());
    }
  };

  const handleSelect = (operation: FormOperation) => {
    dispatch(appendOperation(operation));
    dispatch(hideOperationPicker());
  };

  return (
    <CommandDialog
      open={selector.target !== null}
      onOpenChange={handleOpenChange}
      title="Add a step"
      description="Search for a step to add to the script"
    >
      <CommandInput placeholder="Search steps…" />
      <CommandList>
        <CommandEmpty>No matching steps.</CommandEmpty>
        <CommandGroup heading="Steps">
          {FORM_OPERATIONS.map((operation) => {
            const Icon = OPERATION_ICONS[operation.type];
            return (
              <CommandItem
                key={`operation-${operation.type}`}
                value={`${operation.name} ${operation.description}`}
                onSelect={() => handleSelect(operation)}
              >
                <Icon className="size-4" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {operation.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {operation.description}
                  </p>
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
