import { useNavigate } from "react-router";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import { INITIAL_SCRIPT } from "@/lib/constants";
import { TOAST_MESSAGES } from "@/lib/messages";
import db from "@/database";
import { Script } from "@/types/script";
import ScriptEditor from "./ScriptEditor";

function CreateScreen() {
  const navigate = useNavigate();

  const handleSubmit = (script: Script) => {
    db.createScript(script)
      .then(() => {
        toast.success(TOAST_MESSAGES.SCRIPT_CREATE_SUCCESS);
        navigate("/search");
      })
      .catch(() => {
        toast.error(TOAST_MESSAGES.SCRIPT_CREATE_FAILURE);
      });
  };

  return (
    <>
      <PageHeader title="Create" />
      <ScriptEditor script={INITIAL_SCRIPT} onSubmit={handleSubmit} />
    </>
  );
}

export default CreateScreen;
