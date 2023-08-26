import { Box, TextField } from "@mui/material";
import { ChangeEvent } from "react";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { selectInformation, updateInformation } from "../scriptEditorSlice";

function InformationPanel() {
  const dispatch = useAppDispatch();
  const information = useAppSelector(selectInformation);

  const handleInformationChange = (event: ChangeEvent<HTMLInputElement>) =>
    dispatch(
      updateInformation({ key: event.target.name, value: event.target.value })
    );

  return (
    <Box display="flex" flexDirection="column">
      <TextField
        name="name"
        variant="standard"
        size="small"
        margin="normal"
        label="Name"
        helperText={information.name.error}
        value={information.name.value}
        error={Boolean(information.name.error)}
        onChange={handleInformationChange}
      />
      <TextField
        multiline
        rows={5}
        name="description"
        variant="standard"
        size="small"
        margin="normal"
        label="Description"
        helperText={information.description.error}
        value={information.description.value}
        error={Boolean(information.description.error)}
        onChange={handleInformationChange}
      />
    </Box>
  );
}

export default InformationPanel;
