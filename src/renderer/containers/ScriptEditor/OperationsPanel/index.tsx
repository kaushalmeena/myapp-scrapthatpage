import { Box, Button, Stack } from "@mui/material";
import { get } from "object-path-immutable";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { LargeOperation } from "../../../../common/types/largeOperation";
import { openOperationSelector } from "../../../actions/scriptEditor";
import EmptyText from "../../../components/EmptyText";
import { RootState } from "../../../types/store";
import OperationCard from "./OperationCard";

type OperationsPanelProps = {
  path: string;
};

const OperationsPanel = (props: OperationsPanelProps): JSX.Element => {
  const dispatch = useDispatch();

  const operations = useSelector<RootState, LargeOperation[]>((state) =>
    get(state.scriptEditor, props.path)
  );

  const handleOperationSelectorOpen = () => {
    dispatch(openOperationSelector(props.path));
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
        {operations.length > 0 ? (
          operations.map((operation, index) => (
            <OperationCard
              key={`${props.path}.${index}`}
              path={`${props.path}.${index}`}
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
