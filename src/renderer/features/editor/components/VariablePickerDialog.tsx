import type { Variable } from "@common/types/variable";
import EmptyState from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  hideVariablePicker,
  selectVariablePicker,
  selectVariables,
  updateInputWithVariable
} from "../scriptEditorSlice";

export default function VariablePickerDialog() {
  const dispatch = useAppDispatch();
  const selector = useAppSelector(selectVariablePicker);
  const variables = useAppSelector(selectVariables);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dispatch(hideVariablePicker());
    }
  };

  const handleSelect = (variable: Variable) => {
    dispatch(updateInputWithVariable(variable));
    dispatch(hideVariablePicker());
  };

  const filteredVariables =
    selector.filterType === "any"
      ? variables
      : variables.filter((item: Variable) => item.type === selector.filterType);

  return (
    <Dialog open={selector.target !== null} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Variable</DialogTitle>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          {filteredVariables.length > 0 ? (
            <div className="flex flex-col gap-1">
              {filteredVariables.map((variable: Variable) => (
                <button
                  key={`variable-${variable.name}`}
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md p-3 text-left transition-colors hover:bg-accent"
                  onClick={() => handleSelect(variable)}
                >
                  <span className="truncate font-medium">{variable.name}</span>
                  <Badge variant="secondary">{variable.type}</Badge>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState message="No variables available" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
