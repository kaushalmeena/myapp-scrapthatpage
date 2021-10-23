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
import React from "react";
import ScriptEditor from "../../shared/ScriptEditor";

const Create = (): JSX.Element => {
  return (
    <>
      <Typography fontSize={28} fontWeight="400">
        Create
      </Typography>
      <ScriptEditor />
    </>
  );
};

export default Create;
