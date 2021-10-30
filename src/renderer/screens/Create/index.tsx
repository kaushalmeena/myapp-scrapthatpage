import { CircularProgress, Typography, Box } from "@mui/material";
import React, { useState } from "react";
import { STATUS_TYPES } from "../../constants/layout";
import { createScript } from "../../database/main";
import ScriptEditor from "../../shared/ScriptEditor";
import { Script } from "../../types/script";

const Create = (): JSX.Element => {
  const [status, setStatus] = useState(STATUS_TYPES.SUCCESS);

  const handleSubmit = (script: Script) => {
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
          <ScriptEditor onSubmit={handleSubmit} />
        </>
      )}
    </>
  );
};

export default Create;
