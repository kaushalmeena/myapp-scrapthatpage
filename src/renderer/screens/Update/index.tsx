import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { loadState } from "../../actions/scriptEditor";
import PageName from "../../components/PageName";
import ScriptEditor from "../../containers/ScriptEditor";
import { fetchScript, updateScript } from "../../database/scriptDB";
import { useNotification } from "../../hooks/useNotification";
import { PAGE_STATUS } from "../../types/page";
import { Params } from "../../types/router";
import { ScriptEditorState } from "../../types/scriptEditor";
import {
  getScriptEditorStateFromScript,
  getScriptFromScriptEditorState
} from "../../utils/scriptEditor";

const Update = (): JSX.Element => {
  const dispatch = useDispatch();
  const notification = useNotification();
  const navigate = useNavigate();
  const params = useParams<Params>();

  const [status, setStatus] = useState<PAGE_STATUS>("loading");
  const [error, setError] = useState("");

  const scriptId = Number(params.scriptId);

  useEffect(() => {
    setStatus("loading");
    fetchScript(scriptId)
      .then((script) => {
        if (script) {
          const state = getScriptEditorStateFromScript(script);
          dispatch(loadState(state));
          setStatus("loaded");
        } else {
          setError("Script not found in database.");
          setStatus("error");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Error occurred while fetching.");
        setStatus("error");
      });
  }, []);

  const handleSubmit = (state: ScriptEditorState) => {
    const script = getScriptFromScriptEditorState(state);
    updateScript(script)
      .then(() => {
        notification.show("Script successfully updated!", "success");
        navigate("/search");
      })
      .catch((err) => {
        console.error(err);
        notification.show("Error occurred while updating.", "error");
      });
  };

  return (
    <>
      <PageName name="Update" />
      {status === "loaded" && <ScriptEditor onSubmit={handleSubmit} />}
      {(status === "loading" || status === "error") && (
        <Box
          marginTop={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          {status === "loading" && <CircularProgress />}
          {status === "error" && <Typography variant="h6">{error}</Typography>}
        </Box>
      )}
    </>
  );
};

export default Update;
