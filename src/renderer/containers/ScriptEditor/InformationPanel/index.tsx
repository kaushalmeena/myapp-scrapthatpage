import { Box, TextField } from "@mui/material";
import React, { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateInformation } from "../../../actions/scriptEditor";
import { RootState } from "../../../types/store";

const InformationPanel = (): JSX.Element => {
  const dispatch = useDispatch();

  const information = useSelector(
    (state: RootState) => state.scriptEditor.information
  );

  const handleInformationChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(updateInformation(event.target.value, event.target.name));
  };

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
        error={information.name.error ? true : false}
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
        error={information.description.error ? true : false}
        onChange={handleInformationChange}
      />
    </Box>
  );
};

export default InformationPanel;
