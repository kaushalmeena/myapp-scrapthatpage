import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { INITIAL_SCRIPT_EDITOR_STATE } from "../../constants/scriptEditor";
import { fetchScript, updateScript } from "../../database/main";
import { useSnackbar } from "../../hooks/useSnackbar";
import ScriptEditor from "../../shared/ScriptEditor";
import { PAGE_STATUS } from "../../types/layout";
import { Params } from "../../types/router";
import { ScriptEditorState } from "../../types/scriptEditor";
import {
  getScriptEditorStateFromScript,
  getScriptFromScriptEditorState
} from "../../utils/scriptEditor";

const Update = (): JSX.Element => {
  const { showSnackbar } = useSnackbar();

  const params = useParams<Params>();
  const history = useHistory();

  const [status, setStatus] = useState<PAGE_STATUS>("loading");
  const [error, setError] = useState("");

  const [scriptEditorState, setScriptEditorState] = useState(
    INITIAL_SCRIPT_EDITOR_STATE
  );

  useEffect(() => {
    const id = Number(params.scriptId);
    setStatus("loading");
    fetchScript(id)
      .then((script) => {
        if (script) {
          const state = getScriptEditorStateFromScript(script);
          console.log("=========== stattus", status);
          setStatus("loaded");
          setScriptEditorState(state);
        } else {
          setStatus("error");
          setError("Script not found in database.");
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
        setError("Error occured while loading script.");
      });
  }, []);

  const handleSubmit = (state: ScriptEditorState) => {
    const script = getScriptFromScriptEditorState(state);
    updateScript(script)
      .then(() => {
        showSnackbar("Script successfully updated!", "success");
        history.push("/search");
      })
      .catch((err) => {
        console.error(err);
        showSnackbar("Error ocuured while updating.", "error");
      });
  };

  return (
    <>
      <Typography fontSize={28} fontWeight="400">
        Update
      </Typography>
      {status === "loaded" ? (
        <ScriptEditor
          initialState={scriptEditorState}
          onSubmit={handleSubmit}
        />
      ) : null}
      {status === "loading" || status === "error" ? (
        <Box
          marginY={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          {status === "loading" ? <CircularProgress /> : null}
          {status === "error" ? (
            <Typography variant="h6">{error}</Typography>
          ) : null}
        </Box>
      ) : null}
    </>
  );
};

export default Update;
