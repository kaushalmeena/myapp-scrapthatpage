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
import { initialScriptEditorState } from "../../constants/scriptEditor";
import ScriptEditor from "../../shared/ScriptEditor";
import { convertToLargeOperations } from "../../utils/operations";

const operations = [
  {
    type: 1,
    data: [""]
  }
];

const Update = (): JSX.Element => {
  const [scriptEditorState, setScriptEditorState] = useState(
    initialScriptEditorState
  );

  useEffect(() => {
    setScriptEditorState((prevState) => ({
      ...prevState,
      operations: convertToLargeOperations(operations)
    }));
  }, []);

  return (
    <>
      <Typography fontSize={28} fontWeight="400">
        Update
      </Typography>
      <ScriptEditor initialState={scriptEditorState} />
    </>
  );
};

export default Update;
