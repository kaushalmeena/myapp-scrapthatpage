import { Redo2, Undo2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import store from "@/app/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { Script } from "@/types/script";
import {
  denormalizeState,
  normalizeScript,
  validateEditorState
} from "./editorUtils";
import InformationPanel from "./InformationPanel";
import OperationSelectorDialog from "./OperationSelectorDialog";
import OperationsPanel from "./OperationsPanel";
import {
  getListIds,
  redo,
  replaceState,
  selectCanRedo,
  selectCanUndo,
  undo
} from "./scriptEditorSlice";
import VariableSelectorDialog from "./VariableSelectorDialog";

export default function ScriptEditor({
  script,
  submitLabel,
  onSubmit
}: {
  script: Script;
  // Label for the primary action ("Create script" / "Save changes").
  submitLabel: string;
  onSubmit: (script: Script) => void;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const canUndo = useAppSelector(selectCanUndo);
  const canRedo = useAppSelector(selectCanRedo);
  const stepCount = useAppSelector(
    (state) => getListIds(state.scriptEditor, { parentId: null }).length
  );

  // Standard editor shortcuts: Cmd/Ctrl+Z undoes, Shift+Cmd/Ctrl+Z redoes.
  // Skipped while focus is in a text field so native text undo still works.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== "z"
      ) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
        return;
      }
      event.preventDefault();
      dispatch(event.shiftKey ? redo() : undo());
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  useEffect(() => {
    dispatch(replaceState(normalizeScript(script)));
  }, [dispatch, script]);

  const handleSubmit = () => {
    const currentState = store.getState().scriptEditor;
    const { errors, validatedState } = validateEditorState(currentState);
    if (errors.length > 0) {
      dispatch(replaceState(validatedState));
      toast.error(errors.slice(0, 5).join("\n"));
    } else {
      onSubmit(denormalizeState(currentState));
    }
  };

  const handleUndo = () => dispatch(undo());

  const handleRedo = () => dispatch(redo());

  const handleCancel = () => navigate(-1);

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            title="Undo (Cmd/Ctrl+Z)"
            disabled={!canUndo}
            onClick={handleUndo}
          >
            <Undo2 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            title="Redo (Shift+Cmd/Ctrl+Z)"
            disabled={!canRedo}
            onClick={handleRedo}
          >
            <Redo2 className="size-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{submitLabel}</Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Card className="gap-0 overflow-hidden p-0">
          <div className="border-b px-4 py-2.5">
            <h2 className="text-sm font-semibold">Details</h2>
          </div>
          <div className="p-4">
            <InformationPanel />
          </div>
        </Card>

        <Card className="gap-0 overflow-hidden p-0">
          <div className="flex items-center gap-2 border-b px-4 py-2.5">
            <h2 className="text-sm font-semibold">Steps</h2>
            <Badge
              variant="secondary"
              className="font-normal text-muted-foreground"
            >
              {stepCount}
            </Badge>
            <p className="ml-auto text-xs text-muted-foreground">
              Steps run top to bottom — drag to reorder
            </p>
          </div>
          <div className="p-4">
            <OperationsPanel listRef={{ parentId: null }} numberPrefix="" />
          </div>
        </Card>
      </div>

      <OperationSelectorDialog />
      <VariableSelectorDialog />
    </>
  );
}
