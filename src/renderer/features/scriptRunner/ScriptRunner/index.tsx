import { Box, Card, CardHeader } from "@mui/material";
import { Script } from "../../../types/script";
import { useScriptRunner } from "../useScriptRunner";
import {
  getActionButtonDataForStatus,
  getBackgroundColorForStatus
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
  const { icon, color } = getActionButtonDataForStatus(status);

  return (
    <>
      <Card variant="outlined" sx={{ backgroundColor }}>
        <CardHeader
          avatar={
            <ActionButton
              spinning={icon === "stop"}
              icon={icon}
              color={color}
              onClick={status === "started" ? stop : start}
            />
          }
          title={heading}
          subheader={message}
        />
      </Card>
      {tableData.rows.length > 0 && (
        <Box marginTop={3}>
          <ResultTable data={tableData} />
        </Box>
      )}
    </>
  );
}

export default ScriptRunner;
