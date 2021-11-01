import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { INITIAL_SCRIPT_EDITOR_STATE } from "../../constants/scriptEditor";
import { fetchScript, updateScript } from "../../database/main";
import { useSnackbar } from "../../hooks/useSnackbar";
import PageName from "../../shared/PageName";
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

  const scriptId = Number(params.scriptId);

  useEffect(() => {
    setStatus("loading");
    fetchScript(scriptId)
      .then((script) => {
        if (script) {
          const state = getScriptEditorStateFromScript(script);
          setScriptEditorState(state);
          setStatus("loaded");
        } else {
          setError("Script not found in database.");
          setStatus("error");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Error occured while fetching.");
        setStatus("error");
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
        showSnackbar("Error occured while updating.", "error");
      });
  };

  return (
    <>
      <PageName name="Update" />
      {status === "loaded" ? (
        <ScriptEditor
          initialState={scriptEditorState}
          onSubmit={handleSubmit}
        />
      ) : null}
      {status === "loading" || status === "error" ? (
        <Box
          marginTop={2}
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
