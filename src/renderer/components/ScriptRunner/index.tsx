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
  const { status, heading, message, data, start, stop } =
    useScriptRunner(script);

  const { title, icon, color, backgroundColor } = getRunnerCardInfo(status);

  return (
    <>
      <Card variant="outlined" sx={{ backgroundColor }}>
        <CardHeader
          title={heading}
          subheader={message}
          avatar={
            <ActionButton
              spinning={icon === "stop"}
              title={title}
              icon={icon}
              color={color}
              onClick={status === "started" ? stop : start}
            />
          }
        />
      </Card>
      {data.rows.length > 0 && (
        <Box marginTop={3}>
          <ResultTable data={data} />
        </Box>
      )}
    </>
  );
}

export default ScriptRunner;
