import { useParams } from "react-router";
import AsyncContent from "@/components/AsyncContent";
import PageHeader from "@/components/PageHeader";
import { useScriptById } from "@/features/scripts/useScriptById";
import ScriptRunner from "./ScriptRunner";

function ExecuteScreen() {
  const params = useParams();

  const script = useScriptById(Number(params.scriptId));

  return (
    <>
      <PageHeader title="Execute" />
      <AsyncContent
        status={script === undefined ? "loading" : script ? "loaded" : "error"}
        error="Script not found."
      >
        {script && (
          <>
            <p className="mb-6 text-center text-lg font-medium">
              {script.name}
            </p>
            <ScriptRunner script={script} />
          </>
        )}
      </AsyncContent>
    </>
  );
}

export default ExecuteScreen;
