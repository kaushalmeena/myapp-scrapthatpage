import { Box, Button, Stack, Tab, Tabs } from "@mui/material";
import React, { SyntheticEvent, useState } from "react";
import { batch, useDispatch } from "react-redux";
import { showNotification } from "../../actions/notification";
import { loadState } from "../../actions/scriptEditor";
import { store } from "../../store/store";
import { ScriptEditorState } from "../../types/scriptEditor";
import { validateScriptEditorState } from "../../utils/scriptEditor";
import InformationPanel from "./InformationPanel";
import OperationSelector from "./OperationSelector";
import OperationsPanel from "./OperationsPanel";
import VariableSelector from "./VariableSelector";

type ScriptEditorProps = {
  scriptEditorState: ScriptEditorState;
  onSubmit: (state: ScriptEditorState) => void;
};

const ScriptEditor = (props: ScriptEditorProps): JSX.Element => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: SyntheticEvent, value: number) => {
    setActiveTab(value);
  };

  const handleSubmitClick = () => {
    const state = store.getState().scriptEditor;
    const { errors, newState } = validateScriptEditorState(state);
    if (errors.length > 0) {
      const [message] = errors;
      batch(() => {
        dispatch(loadState(newState));
        dispatch(showNotification(message, "error"));
      });
    } else {
      props.onSubmit(state);
    }
  };

  return (
    <>
      <Stack direction="row" marginBottom={2} justifyContent="flex-end">
        <Button variant="contained" onClick={handleSubmitClick}>
          Submit
        </Button>
      </Stack>
      <Box
        sx={{
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "action.disabledBackground",
          borderRadius: 1,
          backgroundColor: "background.paper"
        }}
      >
        <Box
          sx={{
            borderBottomWidth: 1,
            borderBottomStyle: "solid",
            borderBottomColor: "action.disabledBackground"
          }}
        >
          <Tabs centered value={activeTab} onChange={handleTabChange}>
            <Tab label="Information" />
            <Tab label="Operations" />
          </Tabs>
        </Box>
        <Box padding={2}>
          <Box display={activeTab === 0 ? "block" : "none"}>
            <InformationPanel />
          </Box>
          <Box display={activeTab === 1 ? "block" : "none"}>
            <OperationsPanel path="operations" />
          </Box>
        </Box>
      </Box>
      <OperationSelector />
      <VariableSelector />
    </>
  );
};

export default ScriptEditor;
