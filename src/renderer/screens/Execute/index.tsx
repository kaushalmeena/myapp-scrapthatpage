import {
  Box,
  Button,
  CircularProgress,
  Icon,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { INITIAL_SCRIPT } from "../../constants/script";
import ScriptRunner from "../../containers/ScriptRunner";
import { fetchScript, updateFavoriteScriptField } from "../../database/main";
import { useSnackbar } from "../../hooks/useSnackbar";
import { PAGE_STATUS } from "../../types/layout";
import { Params } from "../../types/router";
import { Script } from "../../types/script";

const Execute = (): JSX.Element => {
  const snackbar = useSnackbar();
  const history = useHistory();
  const params = useParams<Params>();

  const [status, setStatus] = useState<PAGE_STATUS>("loading");
  const [script, setScript] = useState<Script>(INITIAL_SCRIPT);
  const [error, setError] = useState("");

  const [favorite, setFavorite] = useState(0);

  const scriptId = Number(params.scriptId);

  useEffect(() => {
    setStatus("loading");
    fetchScript(scriptId)
      .then((data) => {
        if (data) {
          setScript(data);
          setFavorite(data.favorite);
          setStatus("loaded");
        } else {
          setError("Script not found in database.");
          setStatus("error");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Error occured while fetching.");
        setStatus("error");
      });
  }, []);

  const handleDeleteClick = () => {
    history.push(`/delete/${scriptId}`);
  };

  const handleUpdateClick = () => {
    history.push(`/update/${scriptId}`);
  };

  const handleFavouriteToogle = () => {
    const newFavoriteValue = 1 - favorite;
    updateFavoriteScriptField(scriptId, newFavoriteValue)
      .then(() => {
        setFavorite(newFavoriteValue);
      })
      .catch((err) => {
        console.error(err);
        snackbar.show("Error occured while updating.", "error");
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
        <IconButton color="primary" onClick={handleFavouriteToogle}>
          <Icon>{favorite === 1 ? "favorite" : "favorite_border"}</Icon>
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
        This is script name
      </Typography>
      <ScriptRunner script={script} />
    </>
  );
};

export default Execute;
