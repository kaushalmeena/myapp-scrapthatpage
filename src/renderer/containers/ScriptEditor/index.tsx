import { Box, Button, Stack, Tab, Tabs } from "@mui/material";
import React, { Component, SyntheticEvent } from "react";
import { batch } from "react-redux";
import { showNotification } from "../../actions/notification";
import { loadState } from "../../actions/scriptEditor";
import TabPanel from "../../components/TabPanel";
import { store } from "../../store/store";
import { ScriptEditorState as ScriptEditorReduxState } from "../../types/scriptEditor";
import { validateScriptEditorState } from "../../utils/scriptEditor";
import InformationPanel from "./InformationPanel";
import OperationSelectorDialog from "./OperationSelectorDialog";
import OperationsPanel from "./OperationsPanel";
import VariableSelectorDialog from "./VariableSelectorDialog";

type ScriptEditorProps = {
  onSubmit: (state: ScriptEditorReduxState) => void;
};

type ScriptEditorState = {
  activeTab: number;
};

class ScriptEditor extends Component<ScriptEditorProps, ScriptEditorState> {
  constructor(props: ScriptEditorProps) {
    super(props);
    this.state = {
      activeTab: 0
    };
  }

  handleTabChange = (event: SyntheticEvent, value: number): void => {
    this.setState({ activeTab: value });
  };

  handleSubmitClick = (): void => {
    const state = store.getState().scriptEditor;
    const { errors, newState } = validateScriptEditorState(state);
    if (errors.length > 0) {
      const [message] = errors;
      batch(() => {
        store.dispatch(loadState(newState));
        store.dispatch(showNotification(message, "error"));
      });
    } else {
      this.props.onSubmit(state);
    }
  };

  render(): JSX.Element {
    return (
      <>
        <Stack direction="row" marginBottom={2} justifyContent="flex-end">
          <Button variant="contained" onClick={this.handleSubmitClick}>
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
            <Tabs
              centered
              value={this.state.activeTab}
              onChange={this.handleTabChange}
            >
              <Tab label="Information" />
              <Tab label="Operations" />
            </Tabs>
          </Box>
          <Box padding={2}>
            <TabPanel value={this.state.activeTab} index={0}>
              <InformationPanel />
            </TabPanel>
            <TabPanel value={this.state.activeTab} index={1}>
              <OperationsPanel path="operations" />
            </TabPanel>
          </Box>
        </Box>
        <OperationSelectorDialog />
        <VariableSelectorDialog />
      </>
    );
  }
}

export default ScriptEditor;
