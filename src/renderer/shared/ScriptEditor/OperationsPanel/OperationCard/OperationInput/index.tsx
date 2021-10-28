import { TextField } from "@mui/material";
import React, { Dispatch } from "react";
import {
  ScriptEditorAction,
  updateInput
} from "../../../../../actions/scriptEditor";
import { INPUT_TYPES } from "../../../../../constants/input";
import { IOperationData } from "../../../../../interfaces/operations";

type OperationInputProps = {
  path: string;
  input: IOperationData;
  dispatch: Dispatch<ScriptEditorAction>;
};

const OperationInput = (props: OperationInputProps): JSX.Element | null => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.dispatch(updateInput(event.target.value, props.path));
  };

  switch (props.input.type) {
    case INPUT_TYPES.TEXTAREA:
      return (
        <TextField
          fullWidth
          multiline
          variant="standard"
          size="small"
          rows={5}
          label={props.input.label}
          helperText={props.input.error}
          value={props.input.value}
          error={props.input.error ? true : false}
          onChange={handleChange}
        />
      );
    case INPUT_TYPES.TEXT:
      return (
        <TextField
          fullWidth
          variant="standard"
          size="small"
          label={props.input.label}
          helperText={props.input.error}
          value={props.input.value}
          error={props.input.error ? true : false}
          onChange={handleChange}
        />
      );
    default:
  }

  return null;
};

export default OperationInput;
