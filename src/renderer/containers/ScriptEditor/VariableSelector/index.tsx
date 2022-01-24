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
import { VARIABLE_TYPES } from "../../../../common/constants/variable";
import { Variable } from "../../../../common/types/variable";
import {
  closeVariableSelector,
  updateInputWithVariable
} from "../../../actions/scriptEditor";
import EmptyText from "../../../components/EmptyText";
import { StoreRootState } from "../../../types/store";

const VariableSelector = (): JSX.Element => {
  const dispatch = useDispatch();

  const selector = useSelector(
    (state: StoreRootState) => state.scriptEditor.selector.variable
  );
  const variables = useSelector(
    (state: StoreRootState) => state.scriptEditor.variables
  );

  const handleSelectorClose = () => {
    dispatch(closeVariableSelector());
  };

  const handleSelect = (item: Variable) => {
    dispatch(updateInputWithVariable(item));
    dispatch(closeVariableSelector());
  };

  let filteredVariables = variables;
  if (selector.filterType !== VARIABLE_TYPES.ANY) {
    filteredVariables = filteredVariables.filter(
      (item) => item.type === selector.filterType
    );
  }

  return (
    <Dialog
      maxWidth="sm"
      scroll="paper"
      open={selector.visible}
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
