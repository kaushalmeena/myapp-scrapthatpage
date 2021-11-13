import {
  Icon,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField
} from "@mui/material";
import React, { Dispatch } from "react";
import OperationsPanel from "../..";
import { INPUT_TYPES } from "../../../../../../common/constants/input";
import {
  LargeInput,
  LargeTextInput
} from "../../../../../../common/types/largeOperation";
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

  const renderTextInputAdornment = (input: LargeTextInput) => {
    if ("variablePicker" in input && input.variablePicker) {
      const variablePicker = input.variablePicker;
      return (
        <InputAdornment position="end">
          <IconButton
            title="Show variable picker"
            size="small"
            onClick={() => {
              props.dispatch(openVariableSelector(props.path, variablePicker));
            }}
          >
            <Icon fontSize="small">control_point_duplicate</Icon>
          </IconButton>
        </InputAdornment>
      );
    }
    return null;
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
          onChange={handleInputChange}
          InputProps={{
            ...props.input.inputProps,
            endAdornment: renderTextInputAdornment(props.input)
          }}
        />
      );
    case INPUT_TYPES.SELECT:
      return (
        <TextField
          select
          fullWidth
          variant="standard"
          size="small"
          label={props.input.label}
          helperText={props.input.error}
          value={props.input.value}
          error={props.input.error ? true : false}
          onChange={handleInputChange}
        >
          {props.input.options.map((item) => (
            <MenuItem
              key={`${props.path}-option-${item.value}`}
              value={item.value}
            >
              {item.label}
            </MenuItem>
          ))}
        </TextField>
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
