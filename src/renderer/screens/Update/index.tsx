import {
  InputAdornment,
  Tab,
  TextField,
  Typography,
  Box,
  Tabs,
  Stack,
  Button
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { INITIAL_SCRIPT_EDITOR_STATE } from "../../constants/scriptEditor";
import ScriptEditor from "../../shared/ScriptEditor";
import { Script } from "../../types/script";
import { ScriptEditorState } from "../../types/scriptEditor";
// import { convertToLargeOperations } from "../../utils/operations";

const operations = [
  {
    type: 1,
    data: [""]
  }
];

const Update = (): JSX.Element => {
  const [scriptEditorState, setScriptEditorState] = useState(
    INITIAL_SCRIPT_EDITOR_STATE
  );

  const handleSubmit = (state: ScriptEditorState) => {
    console.log("============ script", state);
  };

  // useEffect(() => {
  //   setScriptEditorState((prevState) => ({
  //     ...prevState,
  //     operations: convertToLargeOperations(operations)
  //   }));
  // }, []);

  return (
    <>
      <Typography fontSize={28} fontWeight="400">
        Update
      </Typography>
      <ScriptEditor
        initialState={INITIAL_SCRIPT_EDITOR_STATE}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Update;
