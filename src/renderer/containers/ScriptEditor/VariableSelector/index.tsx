import {
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText
} from "@mui/material";
import React, { Dispatch } from "react";
import { Variable } from "../../../../common/types/variable";
import {
  closeVariableSelector,
  updateInputWithVariable
} from "../../../actions/scriptEditor";
import EmptyText from "../../../components/EmptyText";
import {
  ScriptEditorAction,
  VariableSelector
} from "../../../types/scriptEditor";

type VariableSelectorProps = {
  variables: Variable[];
  selector: VariableSelector;
  dispatch: Dispatch<ScriptEditorAction>;
};

const VariableSelector = (props: VariableSelectorProps): JSX.Element => {
  const handleSelectorClose = () => {
    props.dispatch(closeVariableSelector());
  };

  const handleSelect = (item: Variable) => {
    props.dispatch(updateInputWithVariable(item));
    props.dispatch(closeVariableSelector());
  };

  let filteredVariables = props.variables;
  if (props.selector.filterType !== "*") {
    filteredVariables = filteredVariables.filter(
      (item) => item.type === props.selector.filterType
    );
  }

  return (
    <Dialog
      maxWidth="sm"
      scroll="paper"
      open={props.selector.visible}
      onClose={handleSelectorClose}
    >
      <DialogTitle>Select Variable</DialogTitle>
      <Box overflow="scroll">
        {filteredVariables.length > 0 ? (
          <List disablePadding>
            {filteredVariables.map((item) => (
              <ListItemButton
                key={`list-item-${item.name}`}
                onClick={() => {
                  handleSelect(item);
                }}
              >
                <ListItemText primary={item.name} secondary={item.type} />
              </ListItemButton>
            ))}
          </List>
        ) : (
          <EmptyText />
        )}
      </Box>
      <DialogActions />
    </Dialog>
  );
};

export default VariableSelector;
