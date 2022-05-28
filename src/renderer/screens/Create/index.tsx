import React, { useEffect } from "react";
import { connect, MapDispatchToProps } from "react-redux";
import { useNavigate } from "react-router";
import { loadState } from "../../actions/scriptEditor";
import PageName from "../../components/PageName";
import { INITIAL_SCRIPT_EDITOR_STATE } from "../../constants/scriptEditor";
import ScriptEditor from "../../containers/ScriptEditor";
import db from "../../database";
import { useNotification } from "../../hooks/useNotification";
import { ScriptEditorState } from "../../types/scriptEditor";
import { getScriptFromScriptEditorState } from "../../utils/scriptEditor";

type CreateDispatchProps = {
  loadInitialEditorState: () => void;
};

type CreateOwnProps = Record<string, never>;

type CreateProps = CreateDispatchProps & CreateOwnProps;

const Create = (props: CreateProps): JSX.Element => {
  const notification = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    props.loadInitialEditorState();
  }, []);

  const handleSubmit = (state: ScriptEditorState) => {
    const script = getScriptFromScriptEditorState(state);
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

const mapDispatchToProps: MapDispatchToProps<
  CreateDispatchProps,
  CreateOwnProps
> = (dispatch) => ({
  loadInitialEditorState: () => dispatch(loadState(INITIAL_SCRIPT_EDITOR_STATE))
});

export default connect(undefined, mapDispatchToProps)(Create);
