import { Redo2, Undo2 } from "lucide-react";
import { useStore } from "zustand";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "../editorStore";

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
  const { undo, redo, pastStates, futureStates } = useStore(
    useEditorStore.temporal
  );
  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;

  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          title="Undo (Cmd/Ctrl+Z)"
          disabled={!canUndo}
          onClick={() => undo()}
        >
          <Undo2 className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          title="Redo (Shift+Cmd/Ctrl+Z)"
          disabled={!canRedo}
          onClick={() => redo()}
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
