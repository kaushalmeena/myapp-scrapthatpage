import { ControlPointDuplicate } from "@mui/icons-material";
import { IconButton, InputAdornment, MenuItem, TextField } from "@mui/material";
import { get } from "lodash";
import { ChangeEvent } from "react";
import { LargeInput } from "../../../common/types/largeOperation";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  showVariableSelector,
  updateInput
} from "../../redux/slices/scriptEditorSlice";
import OperationsPanel from "./OperationsPanel";

type OperationInputProps = {
  path: string;
};

function OperationInput({ path }: OperationInputProps) {
  const dispatch = useAppDispatch();
  const input = useAppSelector(
    (state) => get(state.scriptEditor, path) as LargeInput
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) =>
    dispatch(updateInput({ path, value: event.target.value }));

  const handlePickerOpen = () => dispatch(showVariableSelector(path));

  switch (input.type) {
    case "text":
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
            endAdornment: input.variablePicker && (
              <InputAdornment position="end">
                <IconButton
                  title="Show variable picker"
                  size="small"
                  onClick={handlePickerOpen}
                >
                  <ControlPointDuplicate fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      );
    case "select":
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
    case "operation_box":
      return <OperationsPanel path={`${path}.operations`} />;
  }

  return null;
}

export default OperationInput;
