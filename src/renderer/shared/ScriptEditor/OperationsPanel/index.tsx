import { Box, Button, Stack } from "@mui/material";
import React, { Dispatch } from "react";
import {
  openSelector,
  ScriptEditorAction
} from "../../../actions/scriptEditor";
import { IOperationLarge } from "../../../interfaces/operations";
import OperationCard from "./OperationCard";

type OperationsPanelProps = {
  operations: IOperationLarge[];
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
        {props.operations.map((item, index) => (
          <OperationCard
            key={`operations.${index}`}
            path={`operations.${index}`}
            operation={item}
            dispatch={props.dispatch}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default OperationsPanel;
