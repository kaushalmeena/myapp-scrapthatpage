import {
  Icon,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField
} from "@mui/material";
import { get } from "object-path-immutable";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { RootState } from "../../../../../types/store";

type OperationInputProps = {
  path: string;
};

const OperationInput = (props: OperationInputProps): JSX.Element | null => {
  const dispatch = useDispatch();

  const input = useSelector<RootState, LargeInput>((state: RootState) =>
    get(state.scriptEditor, props.path)
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateInput(event.target.value, props.path));
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
              dispatch(openVariableSelector(props.path, variablePicker));
            }}
          >
            <Icon fontSize="small">control_point_duplicate</Icon>
          </IconButton>
        </InputAdornment>
      );
    }
    return null;
  };

  switch (input.type) {
    case INPUT_TYPES.TEXT:
      return (
        <TextField
          fullWidth
          variant="standard"
          size="small"
          label={input.label}
          helperText={input.error}
          value={input.value}
          error={input.error ? true : false}
          onChange={handleInputChange}
          InputProps={{
            ...input.inputProps,
            endAdornment: renderTextInputAdornment(input)
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
          label={input.label}
          helperText={input.error}
          value={input.value}
          error={input.error ? true : false}
          onChange={handleInputChange}
        >
          {input.options.map((item) => (
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
      return <OperationsPanel path={`${props.path}.operations`} />;
    default:
  }

  return null;
};

export default OperationInput;
