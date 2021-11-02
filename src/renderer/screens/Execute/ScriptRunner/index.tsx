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
import ActionButton from "./ActionButton";
import ResultTable from "./ResultTable";

type ScriptRunnerProps = {};

const ScriptRunner = (props: ScriptRunnerProps): JSX.Element => {
  const [status, setStatus] = useState<ScriptRunnerStatus>("stopped");

  const [actionButtonIcon, setActionButtonIcon] = useState("play_arrow");
  const [actionButtonColor, setActionButtonColor] =
    useState<ActionButtonColor>("primary");

  const handleActionButtonClick = () => {
    switch (status) {
      case "stopped":
        setStatus("started");
        setActionButtonIcon("stop");
        break;
      case "started":
        setStatus("stopped");
        setActionButtonIcon("play_arrow");
        break;
    }
  };

  return (
    <>
      <Card variant="outlined">
        <CardHeader
          avatar={
            <ActionButton
              status={status}
              icon={actionButtonIcon}
              color={actionButtonColor}
              onClick={handleActionButtonClick}
            />
          }
          title="PAUSED"
          subheader="Ready to start"
        />
      </Card>
      <Box marginTop={3}>
        <ResultTable data={[]} />
      </Box>
    </>
  );
};

export default ScriptRunner;
