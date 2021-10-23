import {
  InputAdornment,
  Tab,
  TextField,
  Typography,
  Box,
  Tabs,
  Stack,
  Button,
  Modal
} from "@mui/material";
import React, { useState } from "react";
import OperationCard from "./OperationCard";
import OperationList from "./OperationList";

type OperationsPanelProps = {};

const OperationsPanel = (props: OperationsPanelProps): JSX.Element => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box display="flex" flexDirection="column">
      <Stack direction="row" marginBottom={1} justifyContent="flex-end">
        <Button size="small" variant="outlined" onClick={handleClickOpen}>
          Add
        </Button>
      </Stack>
      <OperationCard />
      <OperationList open={open} onClose={handleClose} />
    </Box>
  );
};

export default OperationsPanel;
