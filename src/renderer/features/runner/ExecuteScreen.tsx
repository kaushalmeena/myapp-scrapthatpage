import { useParams } from "react-router";
import AsyncContent from "@/components/AsyncContent";
import PageHeader from "@/components/PageHeader";
import { useScriptById } from "@/features/scripts/hooks/useScriptById";
import RunnerSection from "./components/RunnerSection";

export default function ExecuteScreen() {
  const params = useParams();

  const script = useScriptById(Number(params.scriptId));

  return (
    <>
      <PageHeader
        back
        title="Run script"
        subtitle={script ? script.name : undefined}
      />
      <AsyncContent
        status={script === undefined ? "loading" : script ? "loaded" : "error"}
        error="Script not found."
      >
        {script && <RunnerSection script={script} />}
      </AsyncContent>
    </>
  );
}
