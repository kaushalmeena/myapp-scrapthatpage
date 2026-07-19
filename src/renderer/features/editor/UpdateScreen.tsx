import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import AsyncContent from "@/components/AsyncContent";
import PageHeader from "@/components/PageHeader";
import db from "@/database";
import { useScriptById } from "@/features/scripts/hooks/useScriptById";
import { TOAST_MESSAGES } from "@/lib/messages";
import type { Script } from "@/types/script";
import ScriptEditor from "./components/ScriptEditor";

export default function UpdateScreen() {
  const navigate = useNavigate();
  const params = useParams();

  const script = useScriptById(Number(params.scriptId));

  const handleSubmit = (updatedScript: Script) => {
    db.updateScript(updatedScript)
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
      <PageHeader back title="Edit script" subtitle={script?.name} />
      <AsyncContent
        status={script === undefined ? "loading" : script ? "loaded" : "error"}
        error="Script not found."
      >
        {script && (
          <ScriptEditor
            script={script}
            submitLabel="Save changes"
            onSubmit={handleSubmit}
          />
        )}
      </AsyncContent>
    </>
  );
}
