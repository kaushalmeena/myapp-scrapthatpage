import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PageName from "../../components/PageName";
import { INITIAL_SCRIPT } from "../../constants/script";
import db from "../../database";
import { useNotification } from "../../features/notification/hooks";
import ScriptEditor from "../../features/scriptEditor/ScriptEditor";
import { PAGE_STATUS } from "../../types/page";
import { Params } from "../../types/router";
import { Script } from "../../types/script";

const Update = (): JSX.Element => {
  const notification = useNotification();
  const navigate = useNavigate();
  const params = useParams<Params>();

  const [status, setStatus] = useState<PAGE_STATUS>("loading");
  const [script, setScript] = useState<Script>(INITIAL_SCRIPT);
  const [error, setError] = useState("");

  const scriptId = Number(params.scriptId);

  useEffect(() => {
    setStatus("loading");
    db.fetchScriptById(scriptId)
      .then((script) => {
        if (script) {
          setStatus("loaded");
          setScript(script);
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

  const handleSubmit = (script: Script) => {
    db.updateScript(script)
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
      {status === "loaded" && (
        <ScriptEditor script={script} onSubmit={handleSubmit} />
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
};

export default Update;
