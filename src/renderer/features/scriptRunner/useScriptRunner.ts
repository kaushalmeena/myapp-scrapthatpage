import { produce } from "immer";
import { evaluate } from "mathjs";
import { useRef, useState } from "react";
import { OperationTypes } from "../../../common/constants/operation";
import { VariableTypes } from "../../../common/constants/variable";
import {
  ExecuteResult,
  ExtractOperationResult,
  ScraperOperation
} from "../../../common/types/scraper";
import { SmallOperation } from "../../../common/types/smallOperation";
import { VariableMapping } from "../../../common/types/variable";
import { Script } from "../../types/script";
import { INITIAL_TABLE_DATA } from "./constants";
import { TableData } from "./types";

export type RunnerStatus =
  | "ready"
  | "started"
  | "stopped"
  | "finished"
  | "error";

export type RunnerExecution = "started" | "stopped";

type RunnerGenerator = Generator<
  ScraperOperation,
  void,
  ScraperOperation
> | null;

function* getOperationGenerator(
  operations: SmallOperation[],
  variables: VariableMapping = {}
): RunnerGenerator {
  for (let i = 0; i < operations.length; i += 1) {
    const operation = operations[i];
    switch (operation.type) {
      case OperationTypes.OPEN:
        {
          const url = operation.inputs[0].value;
          yield {
            type: operation.type,
            url: replaceTextWithVariables(url, variables)
          };
        }
        break;
      case OperationTypes.EXTRACT:
        {
          const name = operation.inputs[0].value;
          const selector = operation.inputs[1].value;
          const attribute = operation.inputs[2].value;
          yield {
            type: operation.type,
            name,
            selector: replaceTextWithVariables(selector, variables),
            attribute
          };
        }
        break;
      case OperationTypes.CLICK:
        {
          const selector = operation.inputs[0].value;
          yield {
            type: operation.type,
            selector: replaceTextWithVariables(selector, variables)
          };
        }
        break;
      case OperationTypes.TYPE:
        {
          const selector = operation.inputs[0].value;
          const text = operation.inputs[1].value;
          yield {
            type: operation.type,
            selector: replaceTextWithVariables(selector, variables),
            text
          };
        }
        break;
      case OperationTypes.SET:
        {
          const name = operation.inputs[0].value;
          const type = operation.inputs[1].value;
          const { value } = operation.inputs[2];
          switch (type) {
            case VariableTypes.STRING:
              variables[name] = String(value);
              break;
            case VariableTypes.NUMBER:
              variables[name] = Number(value);
              break;
          }
        }
        break;
      case OperationTypes.INCREASE:
        {
          const name = operation.inputs[0].value;
          const { value } = operation.inputs[1];
          (variables[name] as number) += Number(value);
        }
        break;
      case OperationTypes.DECREASE:
        {
          const name = operation.inputs[0].value;
          const { value } = operation.inputs[1];
          (variables[name] as number) -= Number(value);
        }
        break;
      case OperationTypes.IF:
        {
          const condition = operation.inputs[0].value;
          const { operations: nestedOperations } = operation.inputs[1];
          const formattedCondition = replaceTextWithVariables(
            condition,
            variables
          );
          const evaluatedValue = evaluate(formattedCondition);
          if (evaluatedValue) {
            yield* getOperationGenerator(nestedOperations, variables);
          }
        }
        break;
      case OperationTypes.WHILE:
        {
          const condition = operation.inputs[0].value;
          const { operations: nestedOperations } = operation.inputs[1];
          let formattedCondition = replaceTextWithVariables(
            condition,
            variables
          );
          let evaluatedValue = evaluate(formattedCondition);
          while (evaluatedValue) {
            yield* getOperationGenerator(nestedOperations, variables);
            formattedCondition = replaceTextWithVariables(condition, variables);
            evaluatedValue = evaluate(formattedCondition);
          }
        }
        break;
    }
  }
}

const replaceTextWithVariables = (text: string, variables: VariableMapping) =>
  text.replace(/{{[\w-]+}}/g, (match: string) => {
    const name = match.slice(2, -2);
    const value = variables[name];
    return String(value);
  });

const processExtractResult = (
  result: ExtractOperationResult,
  tableData: TableData
): TableData =>
  produce(tableData, (draft) => {
    const headerIdx = draft.headers.findIndex(
      (header) => header === result.name
    );

    let rowIdx = 0;
    let colIdx = 0;

    if (headerIdx === -1) {
      draft.headers.push(result.name);
      colIdx = draft.headers.length - 1;
    } else {
      colIdx = headerIdx;
    }

    while (rowIdx < draft.rows.length && rowIdx < result.data.length) {
      draft.rows[rowIdx].splice(colIdx, 1, result.data[rowIdx]);
      rowIdx += 1;
    }

    while (rowIdx < result.data.length) {
      const row = [];
      row[colIdx] = result.data[rowIdx];
      draft.rows.push(row);
      rowIdx += 1;
    }
  });

const getHeaderInfo = (operation: ScraperOperation) => {
  switch (operation.type) {
    case OperationTypes.OPEN:
      return {
        heading: "OPEN",
        message: `${operation.url}`
      };
    case OperationTypes.EXTRACT:
      return {
        heading: "EXTRACT",
        message: `${operation.name} [${operation.selector}]`
      };
    case OperationTypes.CLICK:
      return {
        heading: "CLICK",
        message: `[${operation.selector}]`
      };
    case OperationTypes.TYPE:
      return {
        heading: "TYPE",
        message: `[${operation.selector}] ${operation.text}`
      };
  }
};

type HookReturnType = {
  status: RunnerStatus;
  heading: string;
  message: string;
  tableData: TableData;
  start: () => void;
  stop: () => void;
};

export const useScriptRunner = (script: Script): HookReturnType => {
  const [status, setStatus] = useState<RunnerStatus>("ready");
  const [heading, setHeading] = useState("READY");
  const [message, setMessage] = useState("Ready to start");
  const [tableData, setTableData] = useState<TableData>(INITIAL_TABLE_DATA);

  const execution = useRef<RunnerExecution>("stopped");
  const generator = useRef<RunnerGenerator>(null);

  const stopRunner = () => {
    execution.current = "stopped";
    setStatus("stopped");
    setHeading("STOPPED");
    setMessage("Execution is stopped");
  };

  const finishExecution = () => {
    execution.current = "stopped";
    setStatus("finished");
    setHeading("FINISHED");
    setMessage("Execution is finished");
  };

  const showRunnerError = (error: string) => {
    execution.current = "stopped";
    setStatus("error");
    setHeading("ERROR");
    setMessage(error);
  };

  const processResponse = (response: ExecuteResult) => {
    if ("result" in response && response.result) {
      switch (response.result.type) {
        case OperationTypes.EXTRACT:
          {
            const newTableData = processExtractResult(
              response.result,
              tableData
            );
            setTableData(newTableData);
          }
          break;
      }
    }
  };

  const executeNextOperation = () => {
    if (execution.current !== "started") {
      return;
    }

    const operationData = generator.current?.next();

    if (operationData.done) {
      finishExecution();
      window.scraper.closeWindow();
      return;
    }

    const operation = operationData.value;
    if (!operation) {
      showRunnerError("Didn't found any operation to execute");
      return;
    }

    const { heading, message } = getHeaderInfo(operation);
    setHeading(heading);
    setMessage(message);

    window.scraper
      .runOperation(operation)
      .then((res) => {
        if (res.status === "success") {
          processResponse(res);
          executeNextOperation();
        } else {
          showRunnerError(res.message);
        }
      })
      .catch(() => {
        showRunnerError("Error occurred in executing operation");
      });
  };

  const startRunner = () => {
    execution.current = "started";
    generator.current = getOperationGenerator(script.operations);
    setStatus("started");
    setHeading("STARTED");
    setMessage("Execution is running");
    executeNextOperation();
  };

  return {
    status,
    heading,
    message,
    tableData,
    start: startRunner,
    stop: stopRunner
  };
};
