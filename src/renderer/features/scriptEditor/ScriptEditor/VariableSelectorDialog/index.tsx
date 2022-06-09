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
import { batch } from "react-redux";
import { VariableTypes } from "../../../../../common/constants/variable";
import { Variable } from "../../../../../common/types/variable";
import EmptyText from "../../../../components/EmptyText";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  hideVariableSelector,
  selectVariableSelectorAndVariables,
  updateInputWithVariable
} from "../../scriptEditorSlice";

function VariableSelectorDialog() {
  const dispatch = useAppDispatch();
  const { selector, variables } = useAppSelector(
    selectVariableSelectorAndVariables
  );

  const handleModalClose = () => dispatch(hideVariableSelector());

  const handleSelect = (item: Variable) =>
    batch(() => {
      dispatch(updateInputWithVariable({ variable: item }));
      dispatch(hideVariableSelector());
    });

  let filteredVariables = variables;
  if (selector.filterType !== VariableTypes.ANY) {
    filteredVariables = filteredVariables.filter(
      (item) => item.type === selector.filterType
    );
  }

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
}

export default VariableSelectorDialog;
