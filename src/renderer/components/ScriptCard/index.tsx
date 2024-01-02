import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardHeader
} from "@mui/material";
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

  const handleUpdateClick = () => {
    navigate(`/update/${id}`);
  };

  const handleDeleteClick = () => {
    navigate(`/delete/${id}`);
  };

  return (
    <Card variant="outlined">
      <CardActionArea onClick={handleExecuteClick}>
        <CardHeader title={title} subheader={description} />
      </CardActionArea>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button size="small" color="primary" onClick={handleExecuteClick}>
          Execute
        </Button>
        <Button size="small" color="primary" onClick={handleUpdateClick}>
          Update
        </Button>
        <Button size="small" color="secondary" onClick={handleDeleteClick}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

export default ScriptCard;
