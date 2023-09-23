import {
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText
} from "@mui/material";
import { batch } from "react-redux";
import { LARGE_OPERATIONS } from "../../../common/constants/largeOperations";
import { LargeOperation } from "../../../common/types/largeOperation";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  appendOperation,
  hideOperationSelector,
  selectOperationSelector
} from "../../redux/slices/scriptEditorSlice";

function OperationSelectorDialog() {
  const dispatch = useAppDispatch();
  const selector = useAppSelector(selectOperationSelector);

  const handleModalClose = () => dispatch(hideOperationSelector());

  const handleSelect = (operation: LargeOperation) =>
    batch(() => {
      dispatch(appendOperation(operation));
      dispatch(hideOperationSelector());
    });

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
          {LARGE_OPERATIONS.map((operation) => (
            <ListItemButton
              key={`list-item-${operation.type}`}
              onClick={() => {
                handleSelect(operation);
              }}
            >
              <ListItemText
                primary={operation.name}
                secondary={operation.description}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <DialogActions />
    </Dialog>
  );
}

export default OperationSelectorDialog;
