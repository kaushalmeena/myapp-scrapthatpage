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
import { get } from "lodash";
import React, { useState } from "react";
import { LargeOperation } from "../../../../../../common/types/largeOperation";
import {
  getOperationSubheader,
  isOperationValid
} from "../../../../../../common/utils/operation";
import { useAppDispatch, useAppSelector } from "../../../../../hooks";
import {
  deleteOperation,
  moveDownOperation,
  moveUpOperation
} from "../../../scriptEditorSlice";
import { getOperationNumber } from "../../../utils";
import OperationInput from "./OperationInput";

type OperationCardProps = {
  path: string;
};

function OperationCard({ path }: OperationCardProps) {
  const dispatch = useAppDispatch();
  const operation = useAppSelector<LargeOperation>(
    (state) => get(state.scriptEditor, path),
    (prevOperation, nextOperation) =>
      prevOperation.inputs.length === nextOperation.inputs.length &&
      isOperationValid(prevOperation) === isOperationValid(nextOperation)
  );

  const [expanded, setExpanded] = useState(false);

  const handleExpandToggle = () => {
    setExpanded((value) => !value);
  };

  const handleMoveUpClick = () => dispatch(moveUpOperation(path));

  const handleMoveDownClick = () => dispatch(moveDownOperation(path));

  const handleDeleteClick = () => dispatch(deleteOperation(path));

  const operationNumber = getOperationNumber(path);
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
                key={`${path}.inputs.${index}`}
                xs={12}
                md={"width" in input && input.width}
              >
                <OperationInput path={`${path}.inputs.${index}`} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default OperationCard;
