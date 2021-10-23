import {
  InputAdornment,
  Tab,
  TextField,
  Typography,
  Box,
  Tabs,
  Stack,
  Button
} from "@mui/material";
import React from "react";

type InformationPanelProps = {};

const InformationPanel = (props: InformationPanelProps): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column">
      <TextField variant="standard" size="small" margin="normal" label="Name" />
      <TextField
        multiline
        rows={5}
        variant="standard"
        size="small"
        margin="normal"
        label="Description"
      />
    </Box>
  );
};

export default InformationPanel;
