import React, { useState } from "react";
import { useHistory } from "react-router";
import {
  Button,
  Icon,
  IconButton,
  Stack,
  Typography,
  Box,
  Fab,
  CircularProgress,
  Card,
  CardHeader
} from "@mui/material";
import {
  ActionButtonColor,
  ScriptRunnerStatus
} from "../../../types/scriptRunner";

type ActionButtonProps = {
  status: ScriptRunnerStatus;
  color: ActionButtonColor;
  icon: string;
  onClick: () => void;
};

const ActionButton = (props: ActionButtonProps): JSX.Element => {
  return (
    <Box
      sx={{
        position: "relative",
        "& button": {
          zIndex: 1
        }
      }}
    >
      <Fab size="small" color={props.color} onClick={props.onClick}>
        <Icon>{props.icon}</Icon>
      </Fab>
      {props.status === "started" && (
        <CircularProgress
          color={props.color}
          size={50}
          sx={{ position: "absolute", top: -5, left: -5 }}
        />
      )}
    </Box>
  );
};

export default ActionButton;
