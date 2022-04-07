import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { showNotification } from "../../actions/notification";
import { loadState } from "../../actions/scriptEditor";
import PageName from "../../components/PageName";
import { INITIAL_SCRIPT_EDITOR_STATE } from "../../constants/scriptEditor";
import ScriptEditor from "../../containers/ScriptEditor";
import { createScript } from "../../database/scriptDB";
import { ScriptEditorState } from "../../types/scriptEditor";
import { getScriptFromScriptEditorState } from "../../utils/scriptEditor";

const Create = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loadState(INITIAL_SCRIPT_EDITOR_STATE));
  }, []);

  const handleSubmit = (state: ScriptEditorState) => {
    const script = getScriptFromScriptEditorState(state);
    createScript(script)
      .then(() => {
        dispatch(showNotification("Script successfully created!", "success"));
        navigate("/search");
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
