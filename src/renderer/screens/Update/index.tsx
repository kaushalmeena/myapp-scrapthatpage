import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router";
import PageName from "../../components/PageName";
import { INITIAL_SCRIPT } from "../../constants/script";
import db from "../../database";
import { useNotification } from "../../features/notification/hooks";
import ScriptEditor from "../../features/scriptEditor/ScriptEditor";
import { useDatabaseFetch } from "../../hooks";
import { Params } from "../../types/router";
import { Script } from "../../types/script";

function Update() {
  const notification = useNotification();
  const navigate = useNavigate();
  const params = useParams<Params>();

  const scriptId = Number(params.scriptId);

  const {
    result: fetchedScript,
    status,
    error
  } = useDatabaseFetch<Script>({
    fetcher: db.fetchScriptById(scriptId),
    defaultValue: INITIAL_SCRIPT
  });

  const handleSubmit = (script: Script) => {
    db.updateScript(script)
      .then(() => {
        notification.show("Script successfully updated!", "success");
        navigate("/search");
      })
      .catch(() => {
        notification.show("Error occurred while updating.", "error");
      });
  };

  return (
    <>
      <PageName name="Update" />
      {status === "loaded" && (
        <ScriptEditor script={fetchedScript} onSubmit={handleSubmit} />
      )}
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
}

export default Update;
