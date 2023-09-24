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
import { Variable } from "../../../common/types/variable";
import EmptyText from "../EmptyText";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  hideVariableSelector,
  selectVariableSelector,
  selectVariables,
  updateInputWithVariable
} from "../../redux/slices/scriptEditorSlice";

function VariableSelectorDialog() {
  const dispatch = useAppDispatch();
  const selector = useAppSelector(selectVariableSelector);
  const variables = useAppSelector(selectVariables);

  const handleModalClose = () => dispatch(hideVariableSelector());

  const handleSelect = (variable: Variable) =>
    batch(() => {
      dispatch(updateInputWithVariable(variable));
      dispatch(hideVariableSelector());
    });

  const filteredVariables =
    selector.filterType === "any"
      ? variables
      : variables.filter((item) => item.type === selector.filterType);

  return (
    <Dialog
      maxWidth="sm"
      scroll="paper"
      open={selector.visible}
      onClose={handleModalClose}
    >
      <DialogTitle>Select Variable</DialogTitle>
      <Box overflow="scroll">
        {filteredVariables.length > 0 ? (
          <List disablePadding>
            {filteredVariables.map((variable) => (
              <ListItemButton
                key={`li-${variable.name}`}
                onClick={() => {
                  handleSelect(variable);
                }}
              >
                <ListItemText
                  primary={variable.name}
                  secondary={variable.type}
                />
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
}

export default VariableSelectorDialog;
