import { Box, Button, Stack, Tab, Tabs } from "@mui/material";
import React, { SyntheticEvent, useReducer, useState } from "react";
import { loadState } from "../../actions/scriptEditor";
import { scriptEditorReducer } from "../../reducers/scriptEditor";
import { ScriptEditorState } from "../../types/scriptEditor";
import {
  getVariables,
  validateScriptEditorState
} from "../../utils/scriptEditor";
import InformationPanel from "./InformationPanel";
import OperationSelector from "./OperationSelector";
import OperationsPanel from "./OperationsPanel";
import VariableSelector from "./VariableSelector";

type ScriptEditorProps = {
  scriptEditorState: ScriptEditorState;
  onSubmit: (state: ScriptEditorState) => void;
};

const ScriptEditor = (props: ScriptEditorProps): JSX.Element => {
  const [state, dispatch] = useReducer(
    scriptEditorReducer,
    props.scriptEditorState
  );

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: SyntheticEvent, value: number) => {
    setActiveTab(value);
  };

  const handleSubmitClick = () => {
    const { errors, newState } = validateScriptEditorState(state);
    if (errors.length > 0) {
      const [message] = errors;
      dispatch(loadState(newState));
      // snackbar.show(message, "error");
    } else {
      props.onSubmit(state);
    }
  };

  const variables = getVariables(state.operations);

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
            <InformationPanel
              information={state.information}
              dispatch={dispatch}
            />
          </Box>
          <Box display={activeTab === 1 ? "block" : "none"}>
            <OperationsPanel
              operations={state.operations}
              path="operations"
              dispatch={dispatch}
            />
          </Box>
        </Box>
      </Box>
      <OperationSelector
        selector={state.selector.operation}
        dispatch={dispatch}
      />
      <VariableSelector
        selector={state.selector.variable}
        variables={variables}
        dispatch={dispatch}
      />
    </>
  );
};

export default ScriptEditor;
