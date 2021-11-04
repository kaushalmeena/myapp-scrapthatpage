import React from "react";
import { useHistory } from "react-router";
import { INITIAL_SCRIPT_EDITOR_STATE } from "../../constants/scriptEditor";
import { createScript } from "../../database/main";
import { useSnackbar } from "../../hooks/useSnackbar";
import PageName from "../../components/PageName";
import ScriptEditor from "../../containers/ScriptEditor";
import { ScriptEditorState } from "../../types/scriptEditor";
import { getScriptFromScriptEditorState } from "../../utils/scriptEditor";

const Create = (): JSX.Element => {
  const snackbar = useSnackbar();
  const history = useHistory();

  const handleSubmit = (state: ScriptEditorState) => {
    const script = getScriptFromScriptEditorState(state);
    createScript(script)
      .then(() => {
        snackbar.show("Script successfully created!", "success");
        history.push("/search");
      })
      .catch((err) => {
        console.error(err);
        snackbar.show("Error ocuured while saving script", "error");
      });
  };

  return (
    <>
      <PageName name="Create" />
      <ScriptEditor
        initialState={INITIAL_SCRIPT_EDITOR_STATE}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Create;
