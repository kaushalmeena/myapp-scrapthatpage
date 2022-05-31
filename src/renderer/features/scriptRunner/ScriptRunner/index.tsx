import { Box, Card, CardHeader } from "@mui/material";
import React from "react";
import { Script } from "../../../types/script";
import { useScriptRunner } from "../hooks";
import {
  getBackgroundColorForStatus,
  getIconAndColorForStatus
} from "../utils";
import ActionButton from "./ActionButton";
import ResultTable from "./ResultTable";

type ScriptRunnerProps = {
  script: Script;
};

function ScriptRunner({ script }: ScriptRunnerProps) {
  const { status, heading, message, tableData, start, stop } =
    useScriptRunner(script);

  const backgroundColor = getBackgroundColorForStatus(status);
  const { icon, color } = getIconAndColorForStatus(status);

  return (
    <>
      <Card variant="outlined" sx={{ backgroundColor }}>
        <CardHeader
          avatar={
            <ActionButton
              spinning={icon === "stop"}
              icon={icon}
              color={color}
              onClick={status === "STARTED" ? stop : start}
            />
          }
          title={heading}
          subheader={message}
        />
      </Card>
      {tableData.length > 0 && (
        <Box marginTop={3}>
          <ResultTable data={tableData} />
        </Box>
      )}
    </>
  );
}

export default ScriptRunner;
