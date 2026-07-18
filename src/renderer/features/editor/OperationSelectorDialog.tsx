import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { LARGE_OPERATIONS } from "../../../common/constants/largeOperations";
import { LargeOperation } from "../../../common/types/largeOperation";
import {
  appendOperation,
  hideOperationSelector,
  selectOperationSelector
} from "./scriptEditorSlice";

function OperationSelectorDialog() {
  const dispatch = useAppDispatch();
  const selector = useAppSelector(selectOperationSelector);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dispatch(hideOperationSelector());
    }
  };

  const handleSelect = (operation: LargeOperation) => {
    dispatch(appendOperation(operation));
    dispatch(hideOperationSelector());
  };

  return (
    <Dialog open={selector.visible} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Operation</DialogTitle>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          <div className="flex flex-col gap-1">
            {LARGE_OPERATIONS.map((operation) => (
              <button
                key={`operation-${operation.type}`}
                type="button"
                className="w-full cursor-pointer rounded-md p-3 text-left transition-colors hover:bg-accent"
                onClick={() => handleSelect(operation)}
              >
                <p className="font-medium">{operation.name}</p>
                <p className="text-sm text-muted-foreground">
                  {operation.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OperationSelectorDialog;
