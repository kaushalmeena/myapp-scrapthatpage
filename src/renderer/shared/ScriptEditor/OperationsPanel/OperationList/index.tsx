import {
  InputAdornment,
  Box,
  TextField,
  Typography,
  DialogActions,
  ListItemText,
  List,
  ListSubheader,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent
} from "@mui/material";
import React from "react";
import { CATEGORY_TYPES, OPERTAIONS } from "../../../../constants/operations";

type OperationListProps = {
  open: boolean;
  onClose: () => void;
};

const OperationList = (props: OperationListProps): JSX.Element => {
  return (
    <Dialog
      maxWidth="sm"
      scroll="paper"
      open={props.open}
      onClose={props.onClose}
    >
      <DialogTitle>Select Operation</DialogTitle>
      <Box overflow="scroll">
        <List disablePadding>
          {OPERTAIONS.map((item) => (
            <ListItemButton key={`list-item-${item.type}`}>
              <ListItemText primary={item.type} secondary={item.description} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <DialogActions />
    </Dialog>
  );
};

export default OperationList;
