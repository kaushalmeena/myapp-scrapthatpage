import { Box, Button, Stack, Tab, Tabs } from "@mui/material";
import React, { SyntheticEvent, useReducer, useState } from "react";
import { INITIAL_SCRIPT_EDITOR_STATE } from "../../constants/scriptEditor";
import { scriptEditorReducer } from "../../reducers/scriptEditor";
import { Script } from "../../types/script";
import { convertToScript } from "../../utils/scriptEditor";
import InformationPanel from "./InformationPanel";
import OperationSelector from "./OperationSelector";
import OperationsPanel from "./OperationsPanel";

type ScriptEditorProps = {
  script?: Script;
  onSubmit: (script: Script) => void;
};

const ScriptEditor = (props: ScriptEditorProps): JSX.Element => {
  const [state, dispatch] = useReducer(
    scriptEditorReducer,
    INITIAL_SCRIPT_EDITOR_STATE
  );
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: SyntheticEvent, value: number) => {
    setTabValue(value);
  };

  const handleSaveClick = () => {
    const convertedScript = convertToScript(state);
    props.onSubmit(convertedScript);
  };

  return (
    <>
      <Stack marginBottom={2} direction="row" justifyContent="flex-end">
        <Button variant="contained" onClick={handleSaveClick}>
          Save
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
          <Tabs centered value={tabValue} onChange={handleTabChange}>
            <Tab label="Information" />
            <Tab label="Operations" />
          </Tabs>
        </Box>
        <Box padding={2}>
          <Box display={tabValue === 0 ? "block" : "none"}>
            <InformationPanel
              information={state.information}
              dispatch={dispatch}
            />
          </Box>
          <Box display={tabValue === 1 ? "block" : "none"}>
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
