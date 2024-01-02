import { Box, Card, CardHeader } from "@mui/material";
import { Script } from "../../types/script";
import ActionButton from "./ActionButton";
import ResultTable from "./ResultTable";
import { useScriptRunner } from "./hooks";
import { getRunnerCardInfo } from "./utils";

type ScriptRunnerProps = {
  script: Script;
};

function ScriptRunner({ script }: ScriptRunnerProps) {
  const { status, heading, message, result, start, stop } =
    useScriptRunner(script);

  const { title, color, backgroundColor, Icon } = getRunnerCardInfo(status);

  return (
    <>
      <Card variant="outlined" sx={{ backgroundColor }}>
        <CardHeader
          title={heading}
          subheader={message}
          avatar={
            <ActionButton
              spinning={title === "Stop execution"}
              title={title}
              color={color}
              Icon={Icon}
              onClick={status === "started" ? stop : start}
            />
          }
        />
      </Card>
      {result && (
        <Box marginTop={3}>
          <ResultTable data={result} />
        </Box>
      )}
    </>
  );
}

export default ScriptRunner;
