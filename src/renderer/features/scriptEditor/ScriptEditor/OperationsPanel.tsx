import { Box, Button, Stack } from "@mui/material";
import { get } from "lodash";
import React from "react";
import { LargeOperation } from "../../../../common/types/largeOperation";
import EmptyText from "../../../components/EmptyText";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { showOperationSelector } from "../scriptEditorSlice";
import OperationCard from "./OperationCard";

type OperationalPaneProps = {
  path: string;
};

function OperationsPanel({ path }: OperationalPaneProps) {
  const dispatch = useAppDispatch();
  const operations = useAppSelector<LargeOperation[]>(
    (state) => get(state.scriptEditor, path),
    (prevOperations, nextOperations) =>
      prevOperations.length === nextOperations.length
  );

  const handleAddClick = () => dispatch(showOperationSelector(path));

  return (
    <Box display="flex" flexDirection="column">
      <Stack direction="row" marginBottom={1} justifyContent="flex-end">
        <Button
          title="Add operation"
          size="small"
          variant="outlined"
          onClick={handleAddClick}
        >
          Add
        </Button>
      </Stack>
      <Stack gap={1}>
        {operations.length > 0 ? (
          operations.map((_, index) => (
            <OperationCard key={`${path}.${index}`} path={`${path}.${index}`} />
          ))
        ) : (
          <EmptyText />
        )}
      </Stack>
    </Box>
  );
}

export default OperationsPanel;
