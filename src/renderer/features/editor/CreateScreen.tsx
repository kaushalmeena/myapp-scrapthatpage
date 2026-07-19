import { useNavigate } from "react-router";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import db from "@/database";
import { INITIAL_SCRIPT } from "@/lib/constants";
import { TOAST_MESSAGES } from "@/lib/messages";
import type { Script } from "@/types/script";
import ScriptEditor from "./components/ScriptEditor";

export default function CreateScreen() {
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
      <PageHeader
        back
        title="New script"
        subtitle="Build a scraping script step by step"
      />
      <ScriptEditor
        script={INITIAL_SCRIPT}
        submitLabel="Create script"
        onSubmit={handleSubmit}
      />
    </>
  );
}
