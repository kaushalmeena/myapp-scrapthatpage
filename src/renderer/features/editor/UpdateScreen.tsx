import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import AsyncContent from "@/components/AsyncContent";
import PageHeader from "@/components/PageHeader";
import { INITIAL_SCRIPT } from "@/lib/constants";
import { TOAST_MESSAGES } from "@/lib/messages";
import db from "@/database";
import { useDexieFetch } from "@/hooks/useDexieFetch";
import { Script } from "@/types/script";
import ScriptEditor from "./ScriptEditor";

function UpdateScreen() {
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
        toast.success(TOAST_MESSAGES.SCRIPT_UPDATE_SUCCESS);
        navigate("/search");
      })
      .catch(() => {
        toast.error(TOAST_MESSAGES.SCRIPT_UPDATE_FAILURE);
      });
  };

  return (
    <>
      <PageHeader title="Update" />
      <AsyncContent status={status} error={error}>
        <ScriptEditor script={fetchedScript} onSubmit={handleSubmit} />
      </AsyncContent>
    </>
  );
}

export default UpdateScreen;
