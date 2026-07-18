import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import AsyncContent from "@/components/AsyncContent";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import db from "@/database";
import { useDexieFetch } from "@/hooks/useDexieFetch";
import { INITIAL_SCRIPT } from "@/lib/constants";
import { TOAST_MESSAGES } from "@/lib/messages";
import { Script } from "@/types/script";

function DeleteScreen() {
  const navigate = useNavigate();
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

  const handleYesClick = () => {
    db.deleteScriptById(scriptId)
      .then(() => {
        toast.success(TOAST_MESSAGES.SCRIPT_DELETE_SUCCESS);
        navigate("/search");
      })
      .catch(() => {
        toast.error(TOAST_MESSAGES.SCRIPT_DELETE_FAILURE);
      });
  };

  const handleNoClick = () => {
    navigate(-1);
  };

  return (
    <>
      <PageHeader title="Delete" />
      <AsyncContent status={status} error={error}>
        <div className="mt-4 flex flex-col items-center gap-4">
          <p className="text-lg">Do you want to delete {script.name}?</p>
          <div className="flex flex-row gap-2">
            <Button variant="destructive" onClick={handleYesClick}>
              Yes
            </Button>
            <Button variant="outline" onClick={handleNoClick}>
              No
            </Button>
          </div>
        </div>
      </AsyncContent>
    </>
  );
}

export default DeleteScreen;
