import {
  InputAdornment,
  Tab,
  TextField,
  Typography,
  Box,
  Tabs,
  Stack,
  Button,
  Paper
} from "@mui/material";
import React from "react";
import InformationPanel from "./InformationPanel";
import OperationsPanel from "./OperationsPanel";

const ScriptEditor = (): JSX.Element => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Stack marginBottom={2} direction="row" justifyContent="flex-end">
        <Button variant="contained">Save</Button>
      </Stack>
      <Box
        sx={{
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "action.disabledBackground",
          borderRadius: 1,
          backgroundColor: "background.paper"
        }}
      >
        <Box
          sx={{
            borderBottomWidth: 1,
            borderBottomStyle: "solid",
            borderBottomColor: "action.disabledBackground"
          }}
        >
          <Tabs centered value={value} onChange={handleChange}>
            <Tab label="Information" />
            <Tab label="Operations" />
          </Tabs>
        </Box>
        <Box padding={2}>
          {value === 0 && <InformationPanel />}
          {value === 1 && <OperationsPanel />}
        </Box>
      </Box>
    </>
  );
};

export default ScriptEditor;
