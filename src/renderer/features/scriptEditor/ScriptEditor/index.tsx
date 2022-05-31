import { Box, Button, Stack, Tab, Tabs } from "@mui/material";
import React, { SyntheticEvent, useLayoutEffect, useState } from "react";
import { batch } from "react-redux";
import TabPanel from "../../../components/TabPanel";
import { useAppDispatch } from "../../../hooks";
import store from "../../../store";
import { Script } from "../../../types/script";
import { showNotification } from "../../notification/notificationSlice";
import { updateState } from "../scriptEditorSlice";
import {
  getScriptEditorStateFromScript,
  getScriptFromScriptEditorState,
  validateScriptEditorState
} from "../utils";
import InformationPanel from "./InformationPanel";
import OperationSelectorDialog from "./OperationSelectorDialog";
import OperationsPanel from "./OperationsPanel";
import VariableSelectorDialog from "./VariableSelectorDialog";

type ScriptEditorProps = {
  script: Script;
  onSubmit: (script: Script) => void;
};

function ScriptEditor({ script, onSubmit }: ScriptEditorProps) {
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: SyntheticEvent, value: number): void => {
    setActiveTab(value);
  };

  const handleSubmitClick = (): void => {
    const state = store.getState().scriptEditor;
    const { errors, newState } = validateScriptEditorState(state);
    if (errors.length > 0) {
      const [message] = errors;
      batch(() => {
        dispatch(updateState({ state: newState }));
        dispatch(showNotification({ message, severity: "error" }));
      });
    } else {
      const resultantScript = getScriptFromScriptEditorState(state);
      onSubmit(resultantScript);
    }
  };

  useLayoutEffect(() => {
    const resultantState = getScriptEditorStateFromScript(script);
    dispatch(updateState({ state: resultantState }));
  }, []);

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
          <TabPanel value={activeTab} index={0}>
            <InformationPanel />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <OperationsPanel path="operations" />
          </TabPanel>
        </Box>
      </Box>
      <OperationSelectorDialog />
      <VariableSelectorDialog />
    </>
  );
}

export default ScriptEditor;
