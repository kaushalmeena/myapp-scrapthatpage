import { Typography } from "@mui/material";
import React from "react";
import { initialScriptEditorState } from "../../constants/scriptEditor";
import ScriptEditor from "../../shared/ScriptEditor";

const Create = (): JSX.Element => {
  return (
    <>
      <Typography fontSize={28} fontWeight="400">
        Create
      </Typography>
      <ScriptEditor initialState={initialScriptEditorState} />
    </>
  );
};

export default Create;
