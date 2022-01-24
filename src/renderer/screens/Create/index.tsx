import React, { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { showNotification } from "../../actions/notification";
import { loadState } from "../../actions/scriptEditor";
import PageName from "../../components/PageName";
import { INITIAL_SCRIPT_EDITOR_STATE } from "../../constants/scriptEditor";
import ScriptEditor from "../../containers/ScriptEditor";
import { createScript } from "../../database/script";
import { ScriptEditorState } from "../../types/scriptEditor";
import { getScriptFromScriptEditorState } from "../../utils/scriptEditor";

const Create = (): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();

  useLayoutEffect(() => {
    dispatch(loadState(INITIAL_SCRIPT_EDITOR_STATE));
  }, []);

  const handleSubmit = (state: ScriptEditorState) => {
    const script = getScriptFromScriptEditorState(state);
    createScript(script)
      .then(() => {
        dispatch(showNotification("Script successfully created!", "success"));
        history.push("/search");
      })
      .catch((err) => {
        console.error(err);
        dispatch(
          showNotification("Error ocuured while saving script.", "error")
        );
      });
  };

  return (
    <>
      <PageName name="Create" />
      <ScriptEditor onSubmit={handleSubmit} />
    </>
  );
};

export default Create;
