import { Icon, IconButton, InputAdornment } from "@mui/material";
import React from "react";

type VariablePickerAdornmentProps = {
  visible: boolean;
  onClick: () => void;
};

const VariablePickerAdornment = (props: VariablePickerAdornmentProps) => {
  if (props.visible) {
    return (
      <InputAdornment position="end">
        <IconButton
          title="Show variable picker"
          size="small"
          onClick={props.onClick}
        >
          <Icon fontSize="small">control_point_duplicate</Icon>
        </IconButton>
      </InputAdornment>
    );
  }
  return null;
};

export default VariablePickerAdornment;
