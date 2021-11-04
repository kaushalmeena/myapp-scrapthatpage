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
import { appendOperation, closeSelector } from "../../../actions/scriptEditor";
import { LARGE_OPERTAIONS } from "../../../../common/constants/largeOperations";
import { LargeOperation } from "../../../../common/types/largeOperation";
import {
  OperationSelector,
  ScriptEditorAction
} from "../../../types/scriptEditor";

type OperationSelectorProps = {
  selector: OperationSelector;
  dispatch: Dispatch<ScriptEditorAction>;
};

const OperationSelector = (props: OperationSelectorProps): JSX.Element => {
  const handleSelectorClose = () => {
    props.dispatch(closeSelector());
  };

  const handleSelect = (item: LargeOperation) => {
    props.dispatch(appendOperation(item));
    props.dispatch(closeSelector());
  };

  return (
    <Dialog
      maxWidth="sm"
      scroll="paper"
      open={props.selector.visible}
      onClose={handleSelectorClose}
    >
      <DialogTitle>Select Operation</DialogTitle>
      <Box overflow="scroll">
        <List disablePadding>
          {LARGE_OPERTAIONS.map((item) => (
            <ListItemButton
              key={`list-item-${item.type}`}
              onClick={() => {
                handleSelect(item);
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

export default OperationSelector;
