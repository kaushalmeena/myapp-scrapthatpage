import { Box, Button, CircularProgress, Icon } from "@mui/material";
import React from "react";
import { ActionButtonColor } from "../../../types/scriptRunner";

type ActionButtonProps = {
  spinning: boolean;
  color: ActionButtonColor;
  icon: string;
  onClick: () => void;
};

const ActionButton = (props: ActionButtonProps): JSX.Element => {
  return (
    <Box position="relative">
      <Button
        variant="contained"
        color={props.color}
        onClick={props.onClick}
        sx={{
          padding: 0,
          minWidth: 0,
          height: 40,
          width: 40,
          borderRadius: 12,
          zIndex: 1
        }}
      >
        <Icon>{props.icon}</Icon>
      </Button>
      {props.spinning && (
        <CircularProgress
          size={50}
          sx={{ position: "absolute", top: -5, left: -5 }}
        />
      )}
    </Box>
  );
};

export default ActionButton;
