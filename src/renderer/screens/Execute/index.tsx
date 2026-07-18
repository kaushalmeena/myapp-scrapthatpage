import { Typography } from "@mui/material";
import { useParams } from "react-router";
import AsyncContent from "../../components/AsyncContent";
import PageName from "../../components/PageName";
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

  return (
    <>
      <PageName name="Execute" />
      <AsyncContent status={status} error={error}>
        <Typography
          component="div"
          variant="h5"
          sx={{ marginBottom: 4, textAlign: "center" }}
        >
          {script.name}
        </Typography>
        <ScriptRunner script={script} />
      </AsyncContent>
    </>
  );
}

export default ExecuteScreen;
