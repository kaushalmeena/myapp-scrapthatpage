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
import { batch, useDispatch, useSelector } from "react-redux";
import { LARGE_OPERATIONS } from "../../../../common/constants/largeOperations";
import { LargeOperation } from "../../../../common/types/largeOperation";
import {
  appendOperation,
  hideOperationSelector
} from "../../../actions/scriptEditor";
import { StoreRootState } from "../../../types/store";

const OperationSelector = (): JSX.Element => {
  const dispatch = useDispatch();

  const selector = useSelector(
    (state: StoreRootState) => state.scriptEditor.selector.operation
  );

  const handleModalClose = () => {
    dispatch(hideOperationSelector());
  };

  const handleSelect = (item: LargeOperation) => {
    batch(() => {
      dispatch(appendOperation(item));
      dispatch(hideOperationSelector());
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      scroll="paper"
      open={selector.visible}
      onClose={handleModalClose}
    >
      <DialogTitle>Select Operation</DialogTitle>
      <Box overflow="scroll">
        <List disablePadding>
          {LARGE_OPERATIONS.map((item) => (
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
