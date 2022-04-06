import { Card, CardActionArea, CardHeader } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";

type ScriptCardProps = {
  id?: number;
  title: string;
  description: string;
};

const ScriptCard = (props: ScriptCardProps): JSX.Element => {
  const navigate = useNavigate();

  const handleExecuteClick = () => {
    navigate(`/execute/${props.id}`);
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
