import { Box, Card, CardHeader } from "@mui/material";
import { keys } from "lodash";
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
  const { status, heading, message, results, start, stop } =
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
      {results.length > 0 && (
        <Box marginTop={3}>
          <ResultTable headers={keys(results[0])} rows={results} />
        </Box>
      )}
    </>
  );
}

export default ScriptRunner;
