import {
  OPERATION_SCHEMA,
  OPERATION_TYPES
} from "@common/constants/operationSchema";
import type { OperationType } from "@common/types/operation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { OPERATION_ICONS } from "../constants/operationIcons";
import { selectOperationPicker, useEditorStore } from "../editorStore";

// Searchable step picker (same command-palette interaction as Cmd+K):
// type to filter, Enter or click to add the step.
export default function OperationPickerDialog() {
  const selector = useEditorStore(selectOperationPicker);
  const { appendOperation, hideOperationPicker } = useEditorStore(
    (s) => s.actions
  );

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      hideOperationPicker();
    }
  };

  const handleSelect = (type: OperationType) => {
    appendOperation(type);
    hideOperationPicker();
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
          {OPERATION_TYPES.map((type) => {
            const schema = OPERATION_SCHEMA[type];
            const Icon = OPERATION_ICONS[type];
            return (
              <CommandItem
                key={`operation-${type}`}
                value={`${schema.name} ${schema.description}`}
                onSelect={() => handleSelect(type)}
              >
                <Icon className="size-4" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{schema.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {schema.description}
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
