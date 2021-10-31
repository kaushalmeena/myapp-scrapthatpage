import { Typography } from "@mui/material";
import React from "react";
import { useHistory } from "react-router";
import { INITIAL_SCRIPT_EDITOR_STATE } from "../../constants/scriptEditor";
import { createScript } from "../../database/main";
import { useSnackbar } from "../../hooks/useSnackbar";
import ScriptEditor from "../../shared/ScriptEditor";
import { ScriptEditorState } from "../../types/scriptEditor";
import { getScriptFromScriptEditorState } from "../../utils/scriptEditor";

const Create = (): JSX.Element => {
  const { showSnackbar } = useSnackbar();
  const history = useHistory();

  const handleSubmit = (state: ScriptEditorState) => {
    const script = getScriptFromScriptEditorState(state);
    createScript(script)
      .then(() => {
        showSnackbar("Script successfully created!", "success");
        history.push("/search");
      })
      .catch((err) => {
        console.log("============ err", err);
        showSnackbar("Error ocuured while saving script", "error");
      });
  };

  return (
    <>
      <Typography fontSize={28} fontWeight="400">
        Create
      </Typography>
      <ScriptEditor
        initialState={INITIAL_SCRIPT_EDITOR_STATE}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Create;
