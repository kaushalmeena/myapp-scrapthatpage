import { Redo2, Undo2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import store from "@/app/store";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Script } from "@/types/script";
import {
  denormalizeState,
  normalizeScript,
  validateEditorState
} from "./editorUtils";
import InformationPanel from "./InformationPanel";
import OperationSelectorDialog from "./OperationSelectorDialog";
import OperationsPanel from "./OperationsPanel";
import {
  redo,
  replaceState,
  selectCanRedo,
  selectCanUndo,
  undo
} from "./scriptEditorSlice";
import VariableSelectorDialog from "./VariableSelectorDialog";

type ScriptEditorProps = {
  script: Script;
  onSubmit: (script: Script) => void;
};

function ScriptEditor({ script, onSubmit }: ScriptEditorProps) {
  const dispatch = useAppDispatch();
  const canUndo = useAppSelector(selectCanUndo);
  const canRedo = useAppSelector(selectCanRedo);

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

  const handleSubmitClick = () => {
    const currentState = store.getState().scriptEditor;
    const { errors, validatedState } = validateEditorState(currentState);
    if (errors.length > 0) {
      dispatch(replaceState(validatedState));
      toast.error(errors.slice(0, 5).join("\n"));
    } else {
      onSubmit(denormalizeState(currentState));
    }
  };

  useEffect(() => {
    dispatch(replaceState(normalizeScript(script)));
  }, [dispatch, script]);

  return (
    <>
      <div className="mb-4 flex items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="icon"
          title="Undo (Cmd/Ctrl+Z)"
          disabled={!canUndo}
          onClick={() => dispatch(undo())}
        >
          <Undo2 className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          title="Redo (Shift+Cmd/Ctrl+Z)"
          disabled={!canRedo}
          onClick={() => dispatch(redo())}
        >
          <Redo2 className="size-4" />
        </Button>
        <Button className="ml-2" onClick={handleSubmitClick}>
          Submit
        </Button>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <Tabs defaultValue="information">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="information">Information</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
          </TabsList>
          <TabsContent value="information" className="p-4">
            <InformationPanel />
          </TabsContent>
          <TabsContent value="operations" className="p-4">
            <OperationsPanel listRef={{ parentId: null }} numberPrefix="" />
          </TabsContent>
        </Tabs>
      </div>
      <OperationSelectorDialog />
      <VariableSelectorDialog />
    </>
  );
}

export default ScriptEditor;
