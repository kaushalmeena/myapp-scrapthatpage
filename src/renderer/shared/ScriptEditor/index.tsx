import { Box, Button, Stack, Tab, Tabs } from "@mui/material";
import React, { SyntheticEvent, useReducer } from "react";
import { changeTab } from "../../actions/scriptEditor";
import { IScriptEditorState } from "../../interfaces/scriptEditor";
import { scriptEditorReducer } from "../../reducers/scriptEditor";
import InformationPanel from "./InformationPanel";
import OperationSelector from "./OperationSelector";
import OperationsPanel from "./OperationsPanel";

type ScriptEditorProps = {
  initialState: IScriptEditorState;
};

const ScriptEditor = (props: ScriptEditorProps): JSX.Element => {
  const [state, dispatch] = useReducer(scriptEditorReducer, props.initialState);

  const handleTabChange = (event: SyntheticEvent, value: number) => {
    dispatch(changeTab(value));
  };

  return (
    <>
      <Stack marginBottom={2} direction="row" justifyContent="flex-end">
        <Button variant="contained">Save</Button>
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
          <Tabs centered value={state.activeTab} onChange={handleTabChange}>
            <Tab label="Information" />
            <Tab label="Operations" />
          </Tabs>
        </Box>
        <Box padding={2}>
          <Box display={state.activeTab === 0 ? "block" : "none"}>
            <InformationPanel
              information={state.information}
              dispatch={dispatch}
            />
          </Box>
          <Box display={state.activeTab === 1 ? "block" : "none"}>
            <OperationsPanel
              operations={state.operations}
              dispatch={dispatch}
            />
          </Box>
        </Box>
      </Box>
      <OperationSelector selector={state.selector} dispatch={dispatch} />
    </>
  );
};

export default ScriptEditor;
