import { MenuItem, TextField } from "@mui/material";
import { get } from "object-path-immutable";
import React from "react";
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux";
import OperationsPanel from "../..";
import { INPUT_TYPES } from "../../../../../../common/constants/input";
import { LargeInput } from "../../../../../../common/types/largeOperation";
import {
  showVariableSelector,
  updateInput
} from "../../../../../actions/scriptEditor";
import VariablePickerAdornment from "../../../../../components/VariablePickerAdornment";
import { StoreRootState } from "../../../../../types/store";

type OperationInputStateProps = {
  input: LargeInput;
};

type OperationInputDispatchProps = {
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePickerOpen: () => void;
};

type OperationInputOwnProps = {
  path: string;
};

type OperationInputProps = OperationInputStateProps &
  OperationInputDispatchProps &
  OperationInputOwnProps;

const OperationInput = (props: OperationInputProps): JSX.Element | null => {
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
          error={Boolean(props.input.error)}
          onChange={props.handleInputChange}
          InputProps={{
            ...props.input.inputProps,
            endAdornment: (
              <VariablePickerAdornment
                picker={props.input.variablePicker}
                handlePickerOpen={props.handlePickerOpen}
              />
            )
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
          error={Boolean(props.input.error)}
          onChange={props.handleInputChange}
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
      return <OperationsPanel path={`${props.path}.operations`} />;
    default:
  }

  return null;
};

const mapStateToProps: MapStateToProps<
  OperationInputStateProps,
  OperationInputOwnProps,
  StoreRootState
> = (state, ownProps) => ({
  input: get(state.scriptEditor, ownProps.path) as LargeInput
});

const mapDispatchToProps: MapDispatchToProps<
  OperationInputDispatchProps,
  OperationInputOwnProps
> = (dispatch, ownProps) => ({
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(updateInput(event.target.value, ownProps.path)),
  handlePickerOpen: () => dispatch(showVariableSelector(ownProps.path))
});

export default connect(mapStateToProps, mapDispatchToProps)(OperationInput);
