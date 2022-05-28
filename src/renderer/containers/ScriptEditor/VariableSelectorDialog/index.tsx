import {
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText
} from "@mui/material";
import React from "react";
import {
  batch,
  connect,
  MapDispatchToProps,
  MapStateToProps
} from "react-redux";
import { VARIABLE_TYPES } from "../../../../common/constants/variable";
import { Variable } from "../../../../common/types/variable";
import {
  hideVariableSelector,
  updateInputWithVariable
} from "../../../actions/scriptEditor";
import EmptyText from "../../../components/EmptyText";
import { VariableSelector } from "../../../types/scriptEditor";
import { StoreRootState } from "../../../types/store";

type VariableSelectorDialogStateProps = {
  selector: VariableSelector;
  variables: Variable[];
};

type VariableSelectorDialogDispatchProps = {
  handleModalClose: () => void;
  handleSelect: (item: Variable) => void;
};

type VariableSelectorDialogOwnProps = Record<string, never>;

type VariableSelectorDialogProps = VariableSelectorDialogStateProps &
  VariableSelectorDialogDispatchProps &
  VariableSelectorDialogOwnProps;

const VariableSelectorDialog = (
  props: VariableSelectorDialogProps
): JSX.Element => {
  let filteredVariables = props.variables;
  if (props.selector.filterType !== VARIABLE_TYPES.ANY) {
    filteredVariables = filteredVariables.filter(
      (item) => item.type === props.selector.filterType
    );
  }

  return (
    <Dialog
      maxWidth="sm"
      scroll="paper"
      open={props.selector.visible}
      onClose={props.handleModalClose}
    >
      <DialogTitle>Select Variable</DialogTitle>
      <Box overflow="scroll">
        {filteredVariables.length > 0 ? (
          <List disablePadding>
            {filteredVariables.map((item) => (
              <ListItemButton
                key={`list-item-${item.name}`}
                onClick={() => {
                  props.handleSelect(item);
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

const mapStateToProps: MapStateToProps<
  VariableSelectorDialogStateProps,
  VariableSelectorDialogOwnProps,
  StoreRootState
> = (state) => ({
  selector: state.scriptEditor.variableSelector,
  variables: state.scriptEditor.variables
});

const mapDispatchToProps: MapDispatchToProps<
  VariableSelectorDialogDispatchProps,
  VariableSelectorDialogOwnProps
> = (dispatch) => ({
  handleModalClose: () => dispatch(hideVariableSelector()),
  handleSelect: (item: Variable) =>
    batch(() => {
      dispatch(updateInputWithVariable(item));
      dispatch(hideVariableSelector());
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VariableSelectorDialog);
