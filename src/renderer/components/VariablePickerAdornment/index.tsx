import { Icon, IconButton, InputAdornment } from "@mui/material";
import React from "react";
import { VariablePicker } from "../../../common/types/variable";

type VariablePickerAdornmentProps = {
  picker?: VariablePicker;
  handlePickerOpen: () => void;
};

const VariablePickerAdornment = (props: VariablePickerAdornmentProps) => {
  if (props.picker) {
    return (
      <InputAdornment position="end">
        <IconButton
          title="Show variable picker"
          size="small"
          onClick={props.handlePickerOpen}
        >
          <Icon fontSize="small">control_point_duplicate</Icon>
        </IconButton>
      </InputAdornment>
    );
  }
  return null;
};

export default VariablePickerAdornment;
