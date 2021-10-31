import { Box, Button, Stack } from "@mui/material";
import React, { Dispatch } from "react";
import { openSelector } from "../../../actions/scriptEditor";
import { LargeOperation } from "../../../types/largeOperation";
import { ScriptEditorAction } from "../../../types/scriptEditor";
import OperationCard from "./OperationCard";

type OperationsPanelProps = {
  operations: LargeOperation[];
  dispatch: Dispatch<ScriptEditorAction>;
};

const OperationsPanel = (props: OperationsPanelProps): JSX.Element => {
  const handleSelectorOpen = () => {
    props.dispatch(openSelector("operations"));
  };

  return (
    <Box display="flex" flexDirection="column">
      <Stack direction="row" marginBottom={1} justifyContent="flex-end">
        <Button size="small" variant="outlined" onClick={handleSelectorOpen}>
          Add
        </Button>
      </Stack>
      <Stack gap={1}>
        {props.operations.map((operation, index) => (
          <OperationCard
            key={`operations.${index}`}
            path={`operations.${index}`}
            operation={operation}
            dispatch={props.dispatch}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default OperationsPanel;
