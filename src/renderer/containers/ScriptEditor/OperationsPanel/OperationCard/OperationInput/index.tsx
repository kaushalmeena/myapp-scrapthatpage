import { TextField } from "@mui/material";
import React, { Dispatch } from "react";
import OperationsPanel from "../..";
import { INPUT_TYPES } from "../../../../../../common/constants/input";
import { LargeInput } from "../../../../../../common/types/largeOperation";
import { updateOperation } from "../../../../../actions/scriptEditor";
import { ScriptEditorAction } from "../../../../../types/scriptEditor";

type OperationInputProps = {
  path: string;
  input: LargeInput;
  dispatch: Dispatch<ScriptEditorAction>;
};

const OperationInput = (props: OperationInputProps): JSX.Element | null => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.dispatch(updateOperation(event.target.value, props.path));
  };

  switch (props.input.type) {
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
    case INPUT_TYPES.OPERATION_BOX:
      return (
        <OperationsPanel
          operations={props.input.operations}
          path={`${props.path}.operations`}
          dispatch={props.dispatch}
        />
      );
    default:
  }

  return null;
};

export default OperationInput;