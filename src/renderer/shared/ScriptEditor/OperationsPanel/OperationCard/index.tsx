import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Icon,
  IconButton,
  Stack
} from "@mui/material";
import React, { Dispatch, useState } from "react";
import {
  deleteOperation,
  moveDownOperation,
  moveUpOperation
} from "../../../../actions/scriptEditor";
import { Operation } from "../../../../types/operation";
import { ScriptEditorAction } from "../../../../types/scriptEditor";
import { formatHeading } from "../../../../utils/scriptEditor";
import OperationInput from "./OperationInput";

type OperationCardProps = {
  path: string;
  operation: Operation;
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

  return (
    <Card variant="outlined">
      <CardHeader
        title={props.operation.name}
        subheader={formatHeading(
          props.operation.format,
          props.operation.inputs
        )}
        action={
          <Stack direction="row">
            <IconButton title="Move-up operation" onClick={handleMoveUpClick}>
              <Icon>arrow_upward</Icon>
            </IconButton>
            <IconButton
              title="Move-down operation"
              onClick={handleMoveDownClick}
            >
              <Icon>arrow_downward</Icon>
            </IconButton>
            <IconButton
              title="Edit operation"
              color="primary"
              onClick={handleExpandToogle}
            >
              <Icon>{expanded ? "edit_off" : "edit"}</Icon>
            </IconButton>
            <IconButton
              title="Delete operation"
              color="secondary"
              onClick={handleDeleteClick}
            >
              <Icon>clear</Icon>
            </IconButton>
          </Stack>
        }
      />
      <Collapse in={expanded} timeout="auto">
        <CardContent>
          <Stack gap={2} direction="row" flexWrap="wrap">
            {props.operation.inputs.map((input, index) => (
              <Box
                key={`${props.path}.inputs.${index}`}
                display="flex"
                flex={input.width}
              >
                <OperationInput
                  path={`${props.path}.inputs.${index}`}
                  input={input}
                  dispatch={props.dispatch}
                />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default OperationCard;
