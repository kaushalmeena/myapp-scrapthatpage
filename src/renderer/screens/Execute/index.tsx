import {
  Box,
  Button,
  CircularProgress,
  Icon,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { INITIAL_SCRIPT } from "../../constants/script";
import db from "../../database";
import { useNotification } from "../../hooks/useNotification";
import ScriptRunner from "../../components/ScriptRunner";
import { useDexieFetch } from "../../hooks/useDexieFetch";
import { Script } from "../../types/script";

function Execute() {
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
            ? "Script added to favorites."
            : "Script removed from favorites.",
          "info"
        );
        setFavorite(nextFavorite);
      })
      .catch(() => {
        notification.show("Error occurred while updating.", "error");
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
        <IconButton
          color="primary"
          title={
            favorite
              ? "Add script to favorites"
              : "Remove script from favorites"
          }
          onClick={handleFavoriteToggle}
        >
          <Icon>{favorite ? "favorite" : "favorite_border"}</Icon>
        </IconButton>
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

export default Execute;
