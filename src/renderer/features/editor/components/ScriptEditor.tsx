import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import store from "@/app/store";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { Script } from "@/types/script";
import { useUndoRedoShortcuts } from "../hooks/useUndoRedoShortcuts";
import { getOperationIds, replaceState } from "../scriptEditorSlice";
import {
  denormalizeState,
  normalizeScript,
  validateEditorState
} from "../utils/editorUtils";
import EditorToolbar from "./EditorToolbar";
import ElementPickerDialog from "./ElementPickerDialog";
import InformationPanel from "./InformationPanel";
import OperationPanel from "./OperationPanel";
import OperationPickerDialog from "./OperationPickerDialog";
import VariablePickerDialog from "./VariablePickerDialog";

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
  const stepCount = useAppSelector(
    (s) => getOperationIds(s.scriptEditor, { parentId: null }).length
  );

  useUndoRedoShortcuts();

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

  const handleCancel = () => navigate(-1);

  return (
    <>
      <EditorToolbar
        submitLabel={submitLabel}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

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
            <OperationPanel listRef={{ parentId: null }} numberPrefix="" />
          </div>
        </Card>
      </div>

      <OperationPickerDialog />
      <VariablePickerDialog />
      <ElementPickerDialog />
    </>
  );
}
