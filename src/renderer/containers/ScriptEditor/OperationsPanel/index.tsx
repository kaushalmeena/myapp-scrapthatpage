import { Box, Button, Stack } from "@mui/material";
import { get } from "object-path-immutable";
import React from "react";
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux";
import { LargeOperation } from "../../../../common/types/largeOperation";
import { showOperationSelector } from "../../../actions/scriptEditor";
import EmptyText from "../../../components/EmptyText";
import { StoreRootState } from "../../../types/store";
import OperationCard from "./OperationCard";

type OperationalPaneStateProps = {
  operations: LargeOperation[];
};

type OperationalPaneDispatchProps = {
  handleAddOperationClick: () => void;
};

type OperationalPaneOwnProps = {
  path: string;
};

type OperationalPaneProps = OperationalPaneStateProps &
  OperationalPaneDispatchProps &
  OperationalPaneOwnProps;

const OperationsPanel = (props: OperationalPaneProps): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column">
      <Stack direction="row" marginBottom={1} justifyContent="flex-end">
        <Button
          title="Add operation"
          size="small"
          variant="outlined"
          onClick={props.handleAddOperationClick}
        >
          Add
        </Button>
      </Stack>
      <Stack gap={1}>
        {props.operations.length > 0 ? (
          props.operations.map((_, index) => (
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

const mapStateToProps: MapStateToProps<
  OperationalPaneStateProps,
  OperationalPaneOwnProps,
  StoreRootState
> = (state, ownProps) => ({
  operations: get(state.scriptEditor, ownProps.path) as LargeOperation[]
});

const mapDispatchToProps: MapDispatchToProps<
  OperationalPaneDispatchProps,
  OperationalPaneOwnProps
> = (dispatch, ownProps) => ({
  handleAddOperationClick: () => dispatch(showOperationSelector(ownProps.path))
});

export default connect(mapStateToProps, mapDispatchToProps)(OperationsPanel);
