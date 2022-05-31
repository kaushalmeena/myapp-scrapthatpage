import { Card, CardActionArea, CardHeader } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";

type ScriptCardProps = {
  id: number;
  title: string;
  description: string;
};

function ScriptCard({ id, title, description }: ScriptCardProps) {
  const navigate = useNavigate();

  const handleExecuteClick = () => {
    navigate(`/execute/${id}`);
  };

  return (
    <Card variant="outlined">
      <CardActionArea onClick={handleExecuteClick}>
        <CardHeader title={title} subheader={description} />
      </CardActionArea>
    </Card>
  );
}

export default ScriptCard;
