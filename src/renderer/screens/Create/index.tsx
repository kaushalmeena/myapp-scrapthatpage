import React from "react";
import { useNavigate } from "react-router";
import PageName from "../../components/PageName";
import db from "../../database";
import { useNotification } from "../../features/notification/hooks";
import ScriptEditor from "../../features/scriptEditor/ScriptEditor";
import { Script } from "../../types/script";

const Create = (): JSX.Element => {
  const notification = useNotification();
  const navigate = useNavigate();

  const handleSubmit = (script: Script) => {
    db.createScript(script)
      .then(() => {
        notification.show("Script successfully created!", "success");
        navigate("/search");
      })
      .catch((err) => {
        console.error(err);
        notification.show("Error occurred while saving script.", "error");
      });
  };

  return (
    <>
      <PageName name="Create" />
      <ScriptEditor onSubmit={handleSubmit} />
    </>
  );
};

export default Create;
