import { Card, CardHeader, Icon, IconButton, Stack } from "@mui/material";
import React from "react";
import { useHistory } from "react-router";

type ScriptCardProps = {
  id?: number;
  title: string;
  description: string;
};

const ScriptCard = (props: ScriptCardProps): JSX.Element => {
  const history = useHistory();

  const handleDeleteClick = () => {
    history.push(`/delete/${props.id}`);
  };

  const handleEditClick = () => {
    history.push(`/update/${props.id}`);
  };

  const handleExecuteClick = () => {
    history.push(`/execute/${props.id}`);
  };

  return (
    <Card variant="outlined">
      <CardHeader
        title={props.title}
        subheader={props.description}
        action={
          <Stack direction="row">
            <IconButton color="primary" onClick={handleDeleteClick}>
              <Icon>delete</Icon>
            </IconButton>
            <IconButton color="primary" onClick={handleEditClick}>
              <Icon>edit</Icon>
            </IconButton>
            <IconButton color="primary" onClick={handleExecuteClick}>
              <Icon>play_arrow</Icon>
            </IconButton>
          </Stack>
        }
      />
    </Card>
  );
};

export default ScriptCard;
