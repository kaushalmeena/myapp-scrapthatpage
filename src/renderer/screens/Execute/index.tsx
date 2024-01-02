import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router";
import ScriptRunner from "../../components/ScriptRunner";
import { INITIAL_SCRIPT } from "../../constants/script";
import db from "../../database";
import { useDexieFetch } from "../../hooks/useDexieFetch";
import { Script } from "../../types/script";

function ExecuteScreen() {
  const params = useParams();

  const scriptId = Number(params.scriptId);

  const {
    result: script,
    status,
    error
  } = useDexieFetch<Script>({
    fetcher: () => db.fetchScriptById(scriptId),
    defaultValue: INITIAL_SCRIPT
  });

  if (status === "loading" || status === "error") {
    return (
      <>
        <Box display="flex" marginBottom={2}>
          <Typography fontSize={28} fontWeight="400">
            Execute
          </Typography>
        </Box>
        <Box
          marginTop={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          {status === "loading" && <CircularProgress />}
          {status === "error" && <Typography variant="h6">{error}</Typography>}
        </Box>
      </>
    );
  }

  return (
    <>
      <Box display="flex" marginBottom={2}>
        <Typography fontSize={28} fontWeight="400">
          Execute
        </Typography>
      </Box>
      <Typography
        component="div"
        variant="h5"
        marginBottom={4}
        textAlign="center"
      >
        {script.name}
      </Typography>
      <ScriptRunner script={script} />
    </>
  );
}

export default ExecuteScreen;
