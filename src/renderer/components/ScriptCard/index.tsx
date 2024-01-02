import {
  Close,
  Edit,
  Favorite,
  FavoriteBorder,
  PlayCircle
} from "@mui/icons-material";
import {
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  IconButton
} from "@mui/material";
import { useNavigate } from "react-router";
import { TOAST_MESSAGES } from "../../constants/toast";
import db from "../../database";
import { useNotification } from "../../hooks/useNotification";
import { Script } from "../../types/script";

type ScriptCardProps = {
  script: Script;
  onReload: () => void;
};

function ScriptCard({ script, onReload }: ScriptCardProps) {
  const notification = useNotification();
  const navigate = useNavigate();

  const handleExecuteClick = () => {
    navigate(`/execute/${script.id}`);
  };

  const handleUpdateClick = () => {
    navigate(`/update/${script.id}`);
  };

  const handleDeleteClick = () => {
    navigate(`/delete/${script.id}`);
  };

  const handleFavoriteToggle = () => {
    const nextFavorite = 1 - script.favorite;
    const nextToastMessage = nextFavorite
      ? TOAST_MESSAGES.SCRIPT_FAVORITE_ADD
      : TOAST_MESSAGES.SCRIPT_FAVORITE_REMOVE;
    db.updateScriptFavoriteField(script.id, nextFavorite)
      .then(() => {
        notification.show(nextToastMessage, "info");
        onReload?.();
      })
      .catch(() => {
        notification.show(TOAST_MESSAGES.SCRIPT_UPDATE_FAILURE, "error");
      });
  };

  return (
    <Card sx={{ display: "flex" }} variant="outlined">
      <CardActionArea onClick={handleExecuteClick}>
        <CardHeader title={script.name} subheader={script.description} />
      </CardActionArea>
      <CardActions>
        <IconButton
          title="Execute script"
          size="small"
          color="primary"
          onClick={handleExecuteClick}
        >
          <PlayCircle />
        </IconButton>
        <IconButton
          title="Update script"
          size="small"
          color="primary"
          onClick={handleUpdateClick}
        >
          <Edit />
        </IconButton>
        <IconButton
          title={
            script.favorite
              ? "Remove script from favorites"
              : "Add script to favorites"
          }
          size="small"
          color="primary"
          onClick={handleFavoriteToggle}
        >
          {script.favorite ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
        <IconButton
          title="Delete script"
          size="small"
          color="secondary"
          onClick={handleDeleteClick}
        >
          <Close />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default ScriptCard;
