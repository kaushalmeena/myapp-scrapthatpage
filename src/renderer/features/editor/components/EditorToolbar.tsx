import { Redo2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { redo, selectCanRedo, selectCanUndo, undo } from "../scriptEditorSlice";

// Editor action bar: undo/redo on the left, cancel/submit on the right.
export default function EditorToolbar({
  submitLabel,
  onSubmit,
  onCancel
}: {
  // Label for the primary action ("Create script" / "Save changes").
  submitLabel: string;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const dispatch = useAppDispatch();
  const canUndo = useAppSelector(selectCanUndo);
  const canRedo = useAppSelector(selectCanRedo);

  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          title="Undo (Cmd/Ctrl+Z)"
          disabled={!canUndo}
          onClick={() => dispatch(undo())}
        >
          <Undo2 className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          title="Redo (Shift+Cmd/Ctrl+Z)"
          disabled={!canRedo}
          onClick={() => dispatch(redo())}
        >
          <Redo2 className="size-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>{submitLabel}</Button>
      </div>
    </div>
  );
}
