import { MenuItem, TextField } from "@mui/material";
import { get } from "object-path-immutable";
import React from "react";
import OperationsPanel from "../..";
import { InputTypes } from "../../../../../../../common/constants/input";
import { LargeInput } from "../../../../../../../common/types/largeOperation";
import VariablePickerAdornment from "../../../../../../components/VariablePickerAdornment";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks";
import {
  showVariableSelector,
  updateInput
} from "../../../../scriptEditorSlice";

type OperationInputProps = {
  path: string;
};

function OperationInput({ path }: OperationInputProps) {
  const dispatch = useAppDispatch();
  const input = useAppSelector(
    (state) => get(state.scriptEditor, path) as LargeInput
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(updateInput({ path, value: event.target.value }));

  const handlePickerOpen = () => dispatch(showVariableSelector({ path }));

  switch (input.type) {
    case InputTypes.TEXT:
      return (
        <TextField
          fullWidth
          variant="standard"
          size="small"
          label={input.label}
          helperText={input.error}
          value={input.value}
          error={Boolean(input.error)}
          onChange={handleInputChange}
          InputProps={{
            ...input.inputProps,
            endAdornment: (
              <VariablePickerAdornment
                visible={Boolean(input.variablePicker)}
                onClick={handlePickerOpen}
              />
            )
          }}
        />
      );
    case InputTypes.SELECT:
      return (
        <TextField
          select
          fullWidth
          variant="standard"
          size="small"
          label={input.label}
          helperText={input.error}
          value={input.value}
          error={Boolean(input.error)}
          onChange={handleInputChange}
        >
          {input.options.map((item) => (
            <MenuItem key={`${path}-option-${item.value}`} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>
      );
    case InputTypes.OPERATION_BOX:
      return <OperationsPanel path={`${path}.operations`} />;
    default:
  }

  return null;
}

export default OperationInput;
