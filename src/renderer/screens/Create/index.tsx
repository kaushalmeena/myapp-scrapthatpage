import { useNavigate } from "react-router";
import PageName from "../../components/PageName";
import { INITIAL_SCRIPT } from "../../constants/script";
import db from "../../database";
import { useNotification } from "../../features/notification/useNotification";
import ScriptEditor from "../../features/scriptEditor/ScriptEditor";
import { Script } from "../../types/script";

function Create() {
  const notification = useNotification();
  const navigate = useNavigate();

  const handleSubmit = (script: Script) => {
    db.createScript(script)
      .then(() => {
        notification.show("Script successfully created!", "success");
        navigate("/search");
      })
      .catch(() => {
        notification.show("Error occurred while saving script.", "error");
      });
  };

  return (
    <>
      <PageName name="Create" />
      <ScriptEditor onSubmit={handleSubmit} script={INITIAL_SCRIPT} />
    </>
  );
}

export default Create;
