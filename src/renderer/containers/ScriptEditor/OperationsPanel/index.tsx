import { Box, Button, Stack } from "@mui/material";
import React, { Dispatch } from "react";
import { LargeOperation } from "../../../../common/types/largeOperation";
import { openOperationSelector } from "../../../actions/scriptEditor";
import EmptyText from "../../../components/EmptyText";
import { ScriptEditorAction } from "../../../types/scriptEditor";
import OperationCard from "./OperationCard";

type OperationsPanelProps = {
  operations: LargeOperation[];
  path: string;
  dispatch: Dispatch<ScriptEditorAction>;
};

const OperationsPanel = (props: OperationsPanelProps): JSX.Element => {
  const handleOperationSelectorOpen = () => {
    props.dispatch(openOperationSelector(props.path));
  };

  return (
    <Box display="flex" flexDirection="column">
      <Stack direction="row" marginBottom={1} justifyContent="flex-end">
        <Button
          title="Add operation"
          size="small"
          variant="outlined"
          onClick={handleOperationSelectorOpen}
        >
          Add
        </Button>
      </Stack>
      <Stack gap={1}>
        {props.operations.length > 0 ? (
          props.operations.map((operation, index) => (
            <OperationCard
              key={`${props.path}.${index}`}
              path={`${props.path}.${index}`}
              operation={operation}
              dispatch={props.dispatch}
            />
          ))
        ) : (
          <EmptyText />
        )}
      </Stack>
    </Box>
  );
};

export default OperationsPanel;
