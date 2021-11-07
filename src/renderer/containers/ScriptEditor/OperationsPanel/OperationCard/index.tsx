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
import React, { Dispatch, useState } from "react";
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
import { ScriptEditorAction } from "../../../../types/scriptEditor";
import { getOperationNumber } from "../../../../utils/scriptEditor";
import OperationInput from "./OperationInput";

type OperationCardProps = {
  path: string;
  operation: LargeOperation;
  dispatch: Dispatch<ScriptEditorAction>;
};

const OperationCard = (props: OperationCardProps): JSX.Element => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandToogle = () => {
    setExpanded((value) => !value);
  };

  const handleMoveUpClick = () => {
    props.dispatch(moveUpOperation(props.path));
  };

  const handleMoveDownClick = () => {
    props.dispatch(moveDownOperation(props.path));
  };

  const handleDeleteClick = () => {
    props.dispatch(deleteOperation(props.path));
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
              onClick={handleExpandToogle}
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
            {props.operation.inputs.map((input, index) => (
              <Grid
                item
                key={`${props.path}.inputs.${index}`}
                xs={12}
                md={input.width}
              >
                <OperationInput
                  path={`${props.path}.inputs.${index}`}
                  input={input}
                  dispatch={props.dispatch}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default OperationCard;