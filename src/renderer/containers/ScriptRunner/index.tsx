import { Box, Card, CardHeader } from "@mui/material";
import React, { useRef, useState } from "react";
import { SmallOperation } from "../../../common/types/smallOperation";
import { Script } from "../../types/script";
import {
  ActionButtonColor,
  ScriptRunnerStatus,
  TableData
} from "../../types/scriptRunner";
import {
  appendExtractResultInTableData,
  getCardBackgroundColor,
  getOperationNameAndSubheader,
  operationGenerator
} from "../../utils/scriptRunner";
import ActionButton from "./ActionButton";
import ResultTable from "./ResultTable";

type ScriptRunnerProps = {
  script: Script;
};

const ScriptRunner = (props: ScriptRunnerProps): JSX.Element => {
  const [cardTitle, setCardTitle] = useState("READY");
  const [cardSubheader, setCardSubheader] = useState("Ready to start");
  const [tableData, setTableData] = useState<TableData>([]);

  const [actionButtonRunning, setActionButtonRunning] = useState(false);
  const [actionButtonIcon, setActionButtonIcon] = useState("play_arrow");
  const [actionButtonColor, setActionButtonColor] =
    useState<ActionButtonColor>("primary");

  const runnerStatus = useRef<ScriptRunnerStatus>("stopped");
  const operationExecutor = useRef<Generator<SmallOperation, void, unknown>>();

  const handleRunnerStart = () => {
    runnerStatus.current = "started";
    operationExecutor.current = operationGenerator(props.script.operations);
    setCardTitle("STARTED");
    setCardSubheader("Execution is running");
    setActionButtonRunning(true);
    setActionButtonIcon("stop");
    setActionButtonColor("primary");
  };

  const handleRunnerStop = () => {
    runnerStatus.current = "stopped";
    setCardTitle("STOPPED");
    setCardSubheader("Execution is stopped");
    setActionButtonRunning(false);
    setActionButtonIcon("refresh");
    setActionButtonColor("primary");
  };

  const handleRunnerFinish = () => {
    runnerStatus.current = "stopped";
    setCardTitle("DONE");
    setCardSubheader("Execution is finished");
    setActionButtonRunning(false);
    setActionButtonIcon("refresh");
    setActionButtonColor("success");
  };

  const handleRunnerError = (message: string) => {
    runnerStatus.current = "stopped";
    setCardTitle("ERROR");
    setCardSubheader(message);
    setActionButtonRunning(false);
    setActionButtonIcon("refresh");
    setActionButtonColor("error");
  };

  const executeOperation = async () => {
    if (runnerStatus.current !== "started") {
      return;
    }

    const executorData = operationExecutor.current?.next();

    if (!executorData) {
      handleRunnerError("Didn't found any operation to execute");
      return;
    }

    if (executorData.done) {
      handleRunnerFinish();
    }

    const operation = executorData.value;
    if (!operation) {
      executeOperation();
      return;
    }

    const { name, subheader } = getOperationNameAndSubheader(operation);
    setCardTitle(name);
    setCardSubheader(subheader);

    window.scraper
      .runOperation(operation)
      .then((scraperData) => {
        console.log("=======data", scraperData);
        if (scraperData.status === "success") {
          if ("data" in scraperData && scraperData.data) {
            const newTableData = appendExtractResultInTableData(
              scraperData.data,
              tableData
            );
            setTableData(newTableData);
          }
          executeOperation();
        } else {
          handleRunnerError(scraperData.message);
        }
      })
      .catch((err) => {
        console.error(err);
        handleRunnerError("Error occured in executing operation");
      });
  };

  const handleActionButtonClick = () => {
    switch (runnerStatus.current) {
      case "stopped":
        handleRunnerStart();
        executeOperation();
        break;
      case "started":
        handleRunnerStop();
        break;
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          backgroundColor: getCardBackgroundColor(actionButtonColor)
        }}
      >
        <CardHeader
          avatar={
            <ActionButton
              running={actionButtonRunning}
              icon={actionButtonIcon}
              color={actionButtonColor}
              onClick={handleActionButtonClick}
            />
          }
          title={cardTitle}
          subheader={cardSubheader}
        />
      </Card>
      {tableData.length > 0 && (
        <Box marginTop={3}>
          <ResultTable data={tableData} />
        </Box>
      )}
    </>
  );
};

export default ScriptRunner;
