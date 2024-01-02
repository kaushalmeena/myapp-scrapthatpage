import { useNavigate } from "react-router";
import PageName from "../../components/PageName";
import ScriptEditor from "../../components/ScriptEditor";
import { INITIAL_SCRIPT } from "../../constants/script";
import { TOAST_MESSAGES } from "../../constants/toast";
import db from "../../database";
import { useNotification } from "../../hooks/useNotification";
import { Script } from "../../types/script";

function CreateScreen() {
  const notification = useNotification();
  const navigate = useNavigate();

  const handleSubmit = (script: Script) => {
    db.createScript(script)
      .then(() => {
        notification.show(TOAST_MESSAGES.SCRIPT_CREATE_SUCCESS, "success");
        navigate("/search");
      })
      .catch(() => {
        notification.show(TOAST_MESSAGES.SCRIPT_CREATE_FAILURE, "error");
      });
  };

  return (
    <>
      <PageName name="Create" />
      <ScriptEditor onSubmit={handleSubmit} script={INITIAL_SCRIPT} />
    </>
  );
}

export default CreateScreen;
