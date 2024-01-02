import {
  ArrowDownward,
  ArrowUpward,
  Clear,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  Grid,
  IconButton,
  Stack
} from "@mui/material";
import { get } from "lodash";
import { useState } from "react";
import { LargeOperation } from "../../../common/types/largeOperation";
import {
  isOperationValid,
  replaceFormatWithInputs
} from "../../../common/utils/operation";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  deleteOperation,
  moveDownOperation,
  moveUpOperation
} from "../../redux/slices/scriptEditorSlice";
import OperationInput from "./OperationInput";
import { getOperationNumber } from "./utils";

type OperationCardProps = {
  path: string;
};

function OperationCard({ path }: OperationCardProps) {
  const dispatch = useAppDispatch();
  const operation = useAppSelector(
    (state) => get(state.scriptEditor, path) as LargeOperation
  );

  const [expanded, setExpanded] = useState(false);

  const handleExpandToggle = () => setExpanded((prev) => !prev);

  const handleMoveUpClick = () => dispatch(moveUpOperation(path));

  const handleMoveDownClick = () => dispatch(moveDownOperation(path));

  const handleDeleteClick = () => dispatch(deleteOperation(path));

  const operationNumber = getOperationNumber(path);
  const operationSubheader = replaceFormatWithInputs(
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
      <Stack direction="row">
        <CardActionArea onClick={handleExpandToggle}>
          <CardHeader
            avatar={<Chip variant="outlined" label={operationNumber} />}
            title={operation.name}
            subheader={operationSubheader}
          />
        </CardActionArea>
        <CardActions>
          <IconButton
            size="small"
            title="Move operation up"
            onClick={handleMoveUpClick}
          >
            <ArrowUpward fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            title="Move operation down"
            onClick={handleMoveDownClick}
          >
            <ArrowDownward fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            title={expanded ? "Hide operation inputs" : "Show operation inputs"}
            onClick={handleExpandToggle}
          >
            {expanded ? (
              <Visibility fontSize="small" />
            ) : (
              <VisibilityOff fontSize="small" />
            )}
          </IconButton>
          <IconButton
            size="small"
            title="Delete operation"
            color="secondary"
            onClick={handleDeleteClick}
          >
            <Clear fontSize="small" />
          </IconButton>
        </CardActions>
      </Stack>
      <Collapse in={expanded} timeout="auto">
        <CardContent>
          <Grid container spacing={2}>
            {operation.inputs.map((input, index) => (
              <Grid
                item
                key={`${path}.inputs.${index}`}
                xs={12}
                md={"width" in input ? input.width : undefined}
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
