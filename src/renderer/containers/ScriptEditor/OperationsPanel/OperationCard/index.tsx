import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  Grid,
  Icon,
  IconButton,
  Stack
} from "@mui/material";
import { get } from "object-path-immutable";
import React, { useState } from "react";
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux";
import { LargeOperation } from "../../../../../common/types/largeOperation";
import {
  getOperationSubheader,
  isOperationValid
} from "../../../../../common/utils/operation";
import {
  deleteOperation,
  moveDownOperation,
  moveUpOperation
} from "../../../../actions/scriptEditor";
import { StoreRootState } from "../../../../types/store";
import { getOperationNumber } from "../../../../utils/scriptEditor";
import OperationInput from "./OperationInput";

type OperationCardStateProps = {
  operation: LargeOperation;
};

type OperationCardDispatchProps = {
  handleMoveUpClick: () => void;
  handleMoveDownClick: () => void;
  handleDeleteClick: () => void;
};

type OperationCardOwnProps = {
  path: string;
};

type OperationCardProps = OperationCardStateProps &
  OperationCardDispatchProps &
  OperationCardOwnProps;

const OperationCard = (props: OperationCardProps): JSX.Element => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandToggle = () => {
    setExpanded((value) => !value);
  };

  const operationNumber = getOperationNumber(props.path);
  const operationSubheader = getOperationSubheader(
    props.operation.format,
    props.operation.inputs
  );

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: isOperationValid(props.operation)
          ? "auto"
          : "rgba(211, 47, 47, 0.1)"
      }}
    >
      <CardHeader
        avatar={<Chip variant="outlined" label={operationNumber} />}
        title={props.operation.name}
        subheader={operationSubheader}
        action={
          <Stack direction="row">
            <IconButton
              size="small"
              title="Move-up operation"
              onClick={props.handleMoveUpClick}
            >
              <Icon fontSize="small">arrow_upward</Icon>
            </IconButton>
            <IconButton
              size="small"
              title="Move-down operation"
              onClick={props.handleMoveDownClick}
            >
              <Icon fontSize="small">arrow_downward</Icon>
            </IconButton>
            <IconButton
              size="small"
              title="Edit operation"
              color="primary"
              onClick={handleExpandToggle}
            >
              <Icon fontSize="small">{expanded ? "edit_off" : "edit"}</Icon>
            </IconButton>
            <IconButton
              size="small"
              title="Delete operation"
              color="secondary"
              onClick={props.handleDeleteClick}
            >
              <Icon fontSize="small">clear</Icon>
            </IconButton>
          </Stack>
        }
      />
      <Collapse in={expanded} timeout="auto">
        <CardContent>
          <Grid container spacing={2}>
            {props.operation.inputs.map((input, index) => (
              <Grid
                item
                key={`${props.path}.inputs.${index}`}
                xs={12}
                md={"width" in input && input.width}
              >
                <OperationInput path={`${props.path}.inputs.${index}`} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const mapStateToProps: MapStateToProps<
  OperationCardStateProps,
  OperationCardOwnProps,
  StoreRootState
> = (state, ownProps) => ({
  operation: get(state.scriptEditor, ownProps.path)
});

const mapDispatchToProps: MapDispatchToProps<
  OperationCardDispatchProps,
  OperationCardOwnProps
> = (dispatch, ownProps) => ({
  handleMoveUpClick: () => dispatch(moveUpOperation(ownProps.path)),
  handleMoveDownClick: () => dispatch(moveDownOperation(ownProps.path)),
  handleDeleteClick: () => dispatch(deleteOperation(ownProps.path))
});

export default connect(mapStateToProps, mapDispatchToProps)(OperationCard);
