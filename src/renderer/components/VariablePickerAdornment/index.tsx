import { Icon, IconButton, InputAdornment } from "@mui/material";
import React from "react";

type VariablePickerAdornmentProps = {
  visible: boolean;
  onClick: () => void;
};

function VariablePickerAdornment({
  visible,
  onClick
}: VariablePickerAdornmentProps) {
  if (visible) {
    return (
      <InputAdornment position="end">
        <IconButton title="Show variable picker" size="small" onClick={onClick}>
          <Icon fontSize="small">control_point_duplicate</Icon>
        </IconButton>
      </InputAdornment>
    );
  }
  return null;
}

export default VariablePickerAdornment;
