import React from "react";
import { useHistory } from "react-router";
import { INITIAL_SCRIPT_EDITOR_STATE } from "../../constants/scriptEditor";
import { createScript } from "../../database/script";
import { useNotification } from "../../hooks/useNotification";
import PageName from "../../components/PageName";
import ScriptEditor from "../../containers/ScriptEditor";
import { ScriptEditorState } from "../../types/scriptEditor";
import { getScriptFromScriptEditorState } from "../../utils/scriptEditor";

const Create = (): JSX.Element => {
  const notification = useNotification();
  const history = useHistory();

  const handleSubmit = (state: ScriptEditorState) => {
    const script = getScriptFromScriptEditorState(state);
    createScript(script)
      .then(() => {
        notification.show("Script successfully created!", "success");
        history.push("/search");
      })
      .catch((err) => {
        console.error(err);
        notification.show("Error ocuured while saving script", "error");
      });
  };

  return (
    <>
      <PageName name="Create" />
      <ScriptEditor
        scriptEditorState={INITIAL_SCRIPT_EDITOR_STATE}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Create;
