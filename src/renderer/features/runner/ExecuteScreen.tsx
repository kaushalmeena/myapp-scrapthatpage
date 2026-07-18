import { useParams } from "react-router";
import AsyncContent from "@/components/AsyncContent";
import PageHeader from "@/components/PageHeader";
import db from "@/database";
import { useDexieFetch } from "@/hooks/useDexieFetch";
import { INITIAL_SCRIPT } from "@/lib/constants";
import { Script } from "@/types/script";
import ScriptRunner from "./ScriptRunner";

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
      <PageHeader title="Execute" />
      <AsyncContent status={status} error={error}>
        <p className="mb-6 text-center text-lg font-medium">{script.name}</p>
        <ScriptRunner script={script} />
      </AsyncContent>
    </>
  );
}

export default ExecuteScreen;
