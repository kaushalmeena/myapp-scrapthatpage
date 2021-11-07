import { Icon, IconButton, InputAdornment, TextField } from "@mui/material";
import React, { Dispatch } from "react";
import OperationsPanel from "../..";
import { INPUT_TYPES } from "../../../../../../common/constants/input";
import { LargeInput } from "../../../../../../common/types/largeOperation";
import {
  openVariableSelector,
  updateInput
} from "../../../../../actions/scriptEditor";
import { ScriptEditorAction } from "../../../../../types/scriptEditor";

type OperationInputProps = {
  path: string;
  input: LargeInput;
  dispatch: Dispatch<ScriptEditorAction>;
};

const OperationInput = (props: OperationInputProps): JSX.Element | null => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.dispatch(updateInput(event.target.value, props.path));
  };

  const handleVariableSelectorOpen = () => {
    props.dispatch(openVariableSelector(props.path));
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
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  title="Show variable picker"
                  size="small"
                  onClick={handleVariableSelectorOpen}
                >
                  <Icon fontSize="small">add_box</Icon>
                </IconButton>
              </InputAdornment>
            )
          }}
          onChange={handleInputChange}
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
