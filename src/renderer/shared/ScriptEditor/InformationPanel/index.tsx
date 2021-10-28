import { Box, TextField } from "@mui/material";
import React, { ChangeEvent, Dispatch } from "react";
import {
  ScriptEditorAction,
  setDescription,
  setName
} from "../../../actions/scriptEditor";
import { IInformation } from "../../../interfaces/information";

type InformationPanelProps = {
  information: IInformation;
  dispatch: Dispatch<ScriptEditorAction>;
};

const InformationPanel = (props: InformationPanelProps): JSX.Element => {
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.dispatch(setName(event.target.value));
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.dispatch(setDescription(event.target.value));
  };

  return (
    <Box display="flex" flexDirection="column">
      <TextField
        variant="standard"
        size="small"
        margin="normal"
        label="Name"
        helperText={props.information.name.error}
        value={props.information.name.value}
        error={props.information.name.error ? true : false}
        onChange={handleNameChange}
      />
      <TextField
        multiline
        rows={5}
        variant="standard"
        size="small"
        margin="normal"
        label="Description"
        helperText={props.information.description.error}
        value={props.information.description.value}
        error={props.information.description.error ? true : false}
        onChange={handleDescriptionChange}
      />
    </Box>
  );
};

export default InformationPanel;
