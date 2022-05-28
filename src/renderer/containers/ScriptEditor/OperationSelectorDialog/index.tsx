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
import { LARGE_OPERATIONS } from "../../../../common/constants/largeOperations";
import { LargeOperation } from "../../../../common/types/largeOperation";
import {
  appendOperation,
  hideOperationSelector
} from "../../../actions/scriptEditor";
import { OperationSelector } from "../../../types/scriptEditor";
import { StoreRootState } from "../../../types/store";

type OperationSelectorDialogStateProps = {
  selector: OperationSelector;
};

type OperationSelectorDialogDispatchProps = {
  handleModalClose: () => void;
  handleSelect: (item: LargeOperation) => void;
};

type OperationSelectorDialogOwnProps = Record<string, never>;

type OperationSelectorDialogProps = OperationSelectorDialogStateProps &
  OperationSelectorDialogDispatchProps &
  OperationSelectorDialogOwnProps;

const OperationSelectorDialog = (
  props: OperationSelectorDialogProps
): JSX.Element => {
  return (
    <Dialog
      maxWidth="sm"
      scroll="paper"
      open={props.selector.visible}
      onClose={props.handleModalClose}
    >
      <DialogTitle>Select Operation</DialogTitle>
      <Box overflow="scroll">
        <List disablePadding>
          {LARGE_OPERATIONS.map((item) => (
            <ListItemButton
              key={`list-item-${item.type}`}
              onClick={() => {
                props.handleSelect(item);
              }}
            >
              <ListItemText primary={item.name} secondary={item.description} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <DialogActions />
    </Dialog>
  );
};

const mapStateToProps: MapStateToProps<
  OperationSelectorDialogStateProps,
  OperationSelectorDialogOwnProps,
  StoreRootState
> = (state) => ({
  selector: state.scriptEditor.operationSelector
});

const mapDispatchToProps: MapDispatchToProps<
  OperationSelectorDialogDispatchProps,
  OperationSelectorDialogOwnProps
> = (dispatch) => ({
  handleModalClose: () => dispatch(hideOperationSelector()),
  handleSelect: (item: LargeOperation) =>
    batch(() => {
      dispatch(appendOperation(item));
      dispatch(hideOperationSelector());
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OperationSelectorDialog);
