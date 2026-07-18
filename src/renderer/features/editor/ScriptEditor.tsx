import { useEffect } from "react";
import { toast } from "sonner";
import store from "@/app/store";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { Script } from "@/types/script";
import {
  denormalizeState,
  normalizeScript,
  validateEditorState
} from "./editorUtils";
import InformationPanel from "./InformationPanel";
import OperationSelectorDialog from "./OperationSelectorDialog";
import OperationsPanel from "./OperationsPanel";
import { replaceState } from "./scriptEditorSlice";
import VariableSelectorDialog from "./VariableSelectorDialog";

type ScriptEditorProps = {
  script: Script;
  onSubmit: (script: Script) => void;
};

function ScriptEditor({ script, onSubmit }: ScriptEditorProps) {
  const dispatch = useAppDispatch();

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
      <div className="mb-4 flex justify-end">
        <Button onClick={handleSubmitClick}>Submit</Button>
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
