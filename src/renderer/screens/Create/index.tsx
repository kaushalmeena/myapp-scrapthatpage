import { CircularProgress, Typography, Box } from "@mui/material";
import React, { useState } from "react";
import { STATUS_TYPES } from "../../constants/layout";
import { INITIAL_SCRIPT_EDITOR_STATE } from "../../constants/scriptEditor";
import { createScript } from "../../database/main";
import { useSnackbar } from "../../hooks/useSnackbar";
import ScriptEditor from "../../shared/ScriptEditor";
import { Script } from "../../types/script";
import { ScriptEditorState } from "../../types/scriptEditor";
import { getScriptFromScriptEditorState } from "../../utils/scriptEditor";

const Create = (): JSX.Element => {
  const [status, setStatus] = useState(STATUS_TYPES.SUCCESS);

  const handleSubmit = (state: ScriptEditorState) => {
    const script = getScriptFromScriptEditorState(state);
    createScript(script).then((res) => {
      console.log("============ res", res);
    });
  };

  return (
    <>
      {status === STATUS_TYPES.LOADING && (
        <Box
          sx={{
            height: "calc(100vh - 32px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {status === STATUS_TYPES.SUCCESS && (
        <>
          <Typography fontSize={28} fontWeight="400">
            Create
          </Typography>
          <ScriptEditor
            initialState={INITIAL_SCRIPT_EDITOR_STATE}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </>
  );
};

export default Create;
