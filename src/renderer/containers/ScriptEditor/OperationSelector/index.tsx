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
import { useDispatch, useSelector } from "react-redux";
import { LARGE_OPERTAIONS } from "../../../../common/constants/largeOperations";
import { LargeOperation } from "../../../../common/types/largeOperation";
import {
  appendOperation,
  closeOperationSelector
} from "../../../actions/scriptEditor";
import { RootState } from "../../../types/store";

const OperationSelector = (): JSX.Element => {
  const dispatch = useDispatch();

  const selector = useSelector(
    (state: RootState) => state.scriptEditor.selector.operation
  );

  const handleSelectorClose = () => {
    dispatch(closeOperationSelector());
  };

  const handleSelect = (item: LargeOperation) => {
    dispatch(appendOperation(item));
    dispatch(closeOperationSelector());
  };

  return (
    <Dialog
      maxWidth="sm"
      scroll="paper"
      open={selector.visible}
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
