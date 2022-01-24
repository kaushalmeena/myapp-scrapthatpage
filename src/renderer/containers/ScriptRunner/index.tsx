import { Box, Card, CardHeader } from "@mui/material";
import React, { Component } from "react";
import { OPERATION_TYPES } from "../../../common/constants/operation";
import { ScraperOperation } from "../../../common/types/scraper";
import { Script } from "../../types/script";
import {
  ActionButtonColor,
  ScriptRunnerStatus,
  TableData
} from "../../types/scriptRunner";
import {
  appendExtractResultInTableData,
  getCardBackgroundColor,
  getOperationGenerator,
  getOperationNameAndSubheader
} from "../../utils/scriptRunner";
import ActionButton from "./ActionButton";
import ResultTable from "./ResultTable";

type ScriptRunnerProps = {
  script: Script;
};

type ScriptRunnerState = {
  cardTitle: string;
  cardSubheader: string;
  actionButtonSpinning: boolean;
  actionButtonIcon: string;
  actionButtonColor: ActionButtonColor;
  tableData: TableData;
};

class ScriptRunner extends Component<ScriptRunnerProps, ScriptRunnerState> {
  runnerStatus: ScriptRunnerStatus;
  operationGenerator: Generator<
    ScraperOperation,
    void,
    ScraperOperation
  > | null;

  constructor(props: ScriptRunnerProps) {
    super(props);
    this.state = {
      cardTitle: "READY",
      cardSubheader: "Ready to start",
      actionButtonIcon: "play_arrow",
      actionButtonColor: "primary",
      actionButtonSpinning: false,
      tableData: []
    };
    this.runnerStatus = "stopped";
    this.operationGenerator = null;
  }

  handleRunnerStart = (): void => {
    this.runnerStatus = "started";
    this.operationGenerator = getOperationGenerator(
      this.props.script.operations
    );
    this.setState({
      cardTitle: "STARTED",
      cardSubheader: "Execution is running",
      actionButtonSpinning: true,
      actionButtonIcon: "stop",
      actionButtonColor: "primary"
    });
  };

  handleRunnerStop = (): void => {
    this.runnerStatus = "stopped";
    this.setState({
      cardTitle: "STOPPED",
      cardSubheader: "Execution is stopped",
      actionButtonSpinning: false,
      actionButtonIcon: "refresh",
      actionButtonColor: "primary"
    });
  };

  handleRunnerFinish = (): void => {
    this.runnerStatus = "stopped";
    this.setState({
      cardTitle: "DONE",
      cardSubheader: "Execution is finished",
      actionButtonSpinning: false,
      actionButtonIcon: "refresh",
      actionButtonColor: "success"
    });
  };

  handleRunnerError = (message: string): void => {
    this.runnerStatus = "stopped";
    this.setState({
      cardTitle: "ERROR",
      cardSubheader: message,
      actionButtonSpinning: false,
      actionButtonIcon: "refresh",
      actionButtonColor: "error"
    });
  };

  handleActionButtonClick = (): void => {
    switch (this.runnerStatus) {
      case "stopped":
        this.handleRunnerStart();
        this.handleNextOperation();
        break;
      case "started":
        this.handleRunnerStop();
        break;
    }
  };

  handleNextOperation = (): void => {
    if (this.runnerStatus !== "started") {
      return;
    }

    const operationData = this.operationGenerator?.next();
    if (!operationData) {
      this.handleRunnerError("Didn't found any operation to execute");
      return;
    }
    if (operationData.done) {
      this.handleRunnerFinish();
      window.scraper.closeWindow();
      return;
    }

    const operation = operationData.value;

    const { name, subheader } = getOperationNameAndSubheader(operation);
    this.setState({
      cardTitle: name,
      cardSubheader: subheader
    });

    window.scraper
      .runOperation(operation)
      .then((response) => {
        if (response.status === "success") {
          if ("data" in response && response.data) {
            switch (response.data.type) {
              case OPERATION_TYPES.EXTRACT:
                const newTableData = appendExtractResultInTableData(
                  response.data,
                  this.state.tableData
                );
                this.setState({
                  tableData: newTableData
                });
                break;
            }
          }
          this.handleNextOperation();
        } else {
          this.handleRunnerError(response.message);
        }
      })
      .catch((err) => {
        console.error(err);
        this.handleRunnerError("Error occured in executing operation");
      });
  };

  render(): JSX.Element {
    return (
      <>
        <Card
          variant="outlined"
          sx={{
            backgroundColor: getCardBackgroundColor(
              this.state.actionButtonColor
            )
          }}
        >
          <CardHeader
            avatar={
              <ActionButton
                spinning={this.state.actionButtonSpinning}
                icon={this.state.actionButtonIcon}
                color={this.state.actionButtonColor}
                onClick={this.handleActionButtonClick}
              />
            }
            title={this.state.cardTitle}
            subheader={this.state.cardSubheader}
          />
        </Card>
        {this.state.tableData.length > 0 && (
          <Box marginTop={3}>
            <ResultTable data={this.state.tableData} />
          </Box>
        )}
      </>
    );
  }
}

export default ScriptRunner;
