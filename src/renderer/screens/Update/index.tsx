import { Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import PageName from "../../components/PageName";
import ScriptEditor from "../../components/ScriptEditor";
import { INITIAL_SCRIPT } from "../../constants/script";
import { TOAST_MESSAGES } from "../../constants/toast";
import db from "../../database";
import { useDexieFetch } from "../../hooks/useDexieFetch";
import { useNotification } from "../../hooks/useNotification";
import { Script } from "../../types/script";

function UpdateScreen() {
  const notification = useNotification();
  const navigate = useNavigate();
  const params = useParams();

  const scriptId = Number(params.scriptId);

  const {
    result: fetchedScript,
    status,
    error
  } = useDexieFetch<Script>({
    fetcher: () => db.fetchScriptById(scriptId),
    defaultValue: INITIAL_SCRIPT
  });

  const handleSubmit = (script: Script) => {
    db.updateScript(script)
      .then(() => {
        notification.show(TOAST_MESSAGES.SCRIPT_UPDATE_SUCCESS, "success");
        navigate("/search");
      })
      .catch(() => {
        notification.show(TOAST_MESSAGES.SCRIPT_UPDATE_FAILURE, "error");
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

export default UpdateScreen;
