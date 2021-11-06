import { Box, Button, Stack, Typography } from "@mui/material";
import React, { Dispatch } from "react";
import { openSelector } from "../../../actions/scriptEditor";
import { LargeOperation } from "../../../../common/types/largeOperation";
import { ScriptEditorAction } from "../../../types/scriptEditor";
import OperationCard from "./OperationCard";

type OperationsPanelProps = {
  operations: LargeOperation[];
  path: string;
  dispatch: Dispatch<ScriptEditorAction>;
};

const OperationsPanel = (props: OperationsPanelProps): JSX.Element => {
  const handleSelectorOpen = () => {
    props.dispatch(openSelector(props.path));
  };

  return (
    <Box display="flex" flexDirection="column">
      <Stack direction="row" marginBottom={1} justifyContent="flex-end">
        <Button size="small" variant="outlined" onClick={handleSelectorOpen}>
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
          <Typography
            margin={1}
            textAlign="center"
            color="text.secondary"
            variant="body2"
          >
            &lt; Empty &gt;
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default OperationsPanel;
