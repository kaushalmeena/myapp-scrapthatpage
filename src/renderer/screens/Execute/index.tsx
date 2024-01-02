import { Favorite, FavoriteBorder } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import ScriptRunner from "../../components/ScriptRunner";
import { INITIAL_SCRIPT } from "../../constants/script";
import { TOAST_MESSAGES } from "../../constants/toast";
import db from "../../database";
import { useDexieFetch } from "../../hooks/useDexieFetch";
import { useNotification } from "../../hooks/useNotification";
import { Script } from "../../types/script";

function ExecuteScreen() {
  const notification = useNotification();
  const navigate = useNavigate();
  const params = useParams();

  const [favorite, setFavorite] = useState(false);

  const scriptId = Number(params.scriptId);

  const {
    result: script,
    status,
    error
  } = useDexieFetch<Script>({
    fetcher: db.fetchScriptById(scriptId),
    defaultValue: INITIAL_SCRIPT,
    onSuccess: (data) => setFavorite(Boolean(data.favorite))
  });

  const handleDeleteClick = () => {
    navigate(`/delete/${scriptId}`);
  };

  const handleUpdateClick = () => {
    navigate(`/update/${scriptId}`);
  };

  const handleFavoriteToggle = () => {
    const nextFavorite = !favorite;
    db.updateScriptFavoriteField(scriptId, Number(nextFavorite))
      .then(() => {
        notification.show(
          nextFavorite
            ? TOAST_MESSAGES.SCRIPT_FAVORITE_ADD
            : TOAST_MESSAGES.SCRIPT_FAVORITE_REMOVE,
          "info"
        );
        setFavorite(nextFavorite);
      })
      .catch(() => {
        notification.show(TOAST_MESSAGES.SCRIPT_UPDATE_FAILURE, "error");
      });
  };

  if (status === "loading" || status === "error") {
    return (
      <>
        <Box display="flex" marginBottom={2} justifyContent="space-between">
          <Typography fontSize={28} fontWeight="400">
            Execute
          </Typography>
        </Box>
        <Box
          marginTop={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          {status === "loading" && <CircularProgress />}
          {status === "error" && <Typography variant="h6">{error}</Typography>}
        </Box>
      </>
    );
  }

  return (
    <>
      <Box display="flex" marginBottom={2} justifyContent="space-between">
        <Typography fontSize={28} fontWeight="400">
          Execute
        </Typography>
        {favorite ? (
          <IconButton
            color="primary"
            title="Remove script from favorites"
            onClick={handleFavoriteToggle}
          >
            <Favorite />
          </IconButton>
        ) : (
          <IconButton
            color="primary"
            title="Add script to favorites"
            onClick={handleFavoriteToggle}
          >
            <FavoriteBorder />
          </IconButton>
        )}
      </Box>
      <Stack
        direction="row"
        gap={1}
        sx={{
          marginBottom: 3,
          justifyContent: "flex-end",
          "& button": {
            minWidth: 86
          }
        }}
      >
        <Button variant="contained" onClick={handleUpdateClick}>
          Update
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleDeleteClick}
        >
          Delete
        </Button>
      </Stack>
      <Typography
        component="div"
        variant="h5"
        marginBottom={4}
        textAlign="center"
      >
        {script.name}
      </Typography>
      <ScriptRunner script={script} />
    </>
  );
}

export default ExecuteScreen;
