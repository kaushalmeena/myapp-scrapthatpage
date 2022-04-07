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
import { useDispatch, useSelector } from "react-redux";
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

type OperationCardProps = {
  path: string;
};

const OperationCard = (props: OperationCardProps): JSX.Element => {
  const dispatch = useDispatch();

  const [expanded, setExpanded] = useState(false);

  const operation = useSelector<StoreRootState, LargeOperation>((state) =>
    get(state.scriptEditor, props.path)
  );

  const handleExpandToggle = () => {
    setExpanded((value) => !value);
  };

  const handleMoveUpClick = () => {
    dispatch(moveUpOperation(props.path));
  };

  const handleMoveDownClick = () => {
    dispatch(moveDownOperation(props.path));
  };

  const handleDeleteClick = () => {
    dispatch(deleteOperation(props.path));
  };

  const operationNumber = getOperationNumber(props.path);
  const operationSubheader = getOperationSubheader(
    operation.format,
    operation.inputs
  );

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: isOperationValid(operation)
          ? "auto"
          : "rgba(211, 47, 47, 0.1)"
      }}
    >
      <CardHeader
        avatar={<Chip variant="outlined" label={operationNumber} />}
        title={operation.name}
        subheader={operationSubheader}
        action={
          <Stack direction="row">
            <IconButton
              size="small"
              title="Move-up operation"
              onClick={handleMoveUpClick}
            >
              <Icon fontSize="small">arrow_upward</Icon>
            </IconButton>
            <IconButton
              size="small"
              title="Move-down operation"
              onClick={handleMoveDownClick}
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
              onClick={handleDeleteClick}
            >
              <Icon fontSize="small">clear</Icon>
            </IconButton>
          </Stack>
        }
      />
      <Collapse in={expanded} timeout="auto">
        <CardContent>
          <Grid container spacing={2}>
            {operation.inputs.map((input, index) => (
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

export default OperationCard;
