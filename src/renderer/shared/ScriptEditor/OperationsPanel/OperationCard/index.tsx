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
import React, { Dispatch } from "react";
import {
  deleteOperation,
  moveDownOperation,
  moveUpOperation,
  ScriptEditorAction,
  toogleCardContent
} from "../../../../actions/scriptEditor";
import { IOperationLarge } from "../../../../interfaces/operations";
import { formatHeading } from "../../../../utils/operations";
import OperationInput from "./OperationInput";

type OperationCardProps = {
  path: string;
  operation: IOperationLarge;
  dispatch: Dispatch<ScriptEditorAction>;
};

const OperationCard = (props: OperationCardProps): JSX.Element => {
  const handleExpandToogle = () => {
    props.dispatch(toogleCardContent(props.path));
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
        subheader={formatHeading(props.operation.format, props.operation.data)}
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
              <Icon>{props.operation.expanded ? "edit_off" : "edit"}</Icon>
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
      <Collapse in={props.operation.expanded} timeout="auto">
        <CardContent>
          <Stack gap={2} direction="row" flexWrap="wrap">
            {props.operation.data.map((item, index) => (
              <Box
                key={`${props.path}.data.${index}`}
                display="flex"
                flex={item.width}
              >
                <OperationInput
                  path={`${props.path}.data.${index}`}
                  input={item}
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
