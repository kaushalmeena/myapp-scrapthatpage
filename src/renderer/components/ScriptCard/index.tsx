import { Card, CardActionArea, CardHeader } from "@mui/material";
import React from "react";
import { useHistory } from "react-router";

type ScriptCardProps = {
  id?: number;
  title: string;
  description: string;
};

const ScriptCard = (props: ScriptCardProps): JSX.Element => {
  const history = useHistory();

  const handleExecuteClick = () => {
    history.push(`/execute/${props.id}`);
  };

  return (
    <Card variant="outlined">
      <CardActionArea onClick={handleExecuteClick}>
        <CardHeader title={props.title} subheader={props.description} />
      </CardActionArea>
    </Card>
  );
};

export default ScriptCard;
