import { Box, TextField } from "@mui/material";
import React, { ChangeEvent, Dispatch } from "react";
import { updateInformation } from "../../../actions/scriptEditor";
import { Information } from "../../../types/information";
import { ScriptEditorAction } from "../../../types/scriptEditor";

type InformationPanelProps = {
  information: Information;
  dispatch: Dispatch<ScriptEditorAction>;
};

const InformationPanel = (props: InformationPanelProps): JSX.Element => {
  const handleInformationChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.dispatch(updateInformation(event.target.value, event.target.name));
  };

  return (
    <Box display="flex" flexDirection="column">
      <TextField
        name="name"
        variant="standard"
        size="small"
        margin="normal"
        label="Name"
        helperText={props.information.name.error}
        value={props.information.name.value}
        error={props.information.name.error ? true : false}
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
        helperText={props.information.description.error}
        value={props.information.description.value}
        error={props.information.description.error ? true : false}
        onChange={handleInformationChange}
      />
    </Box>
  );
};

export default InformationPanel;
