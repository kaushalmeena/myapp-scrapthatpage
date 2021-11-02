import {
  Button,
  Icon,
  IconButton,
  Stack,
  Typography,
  Box,
  Fab,
  CircularProgress
} from "@mui/material";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router";
import { updateFavoriteScriptField } from "../../database/main";
import { useSnackbar } from "../../hooks/useSnackbar";
import PageName from "../../shared/PageName";
import { Params } from "../../types/router";
import { ScriptRunnerStatus } from "../../types/scriptRunner";
import ScriptRunner from "./ScriptRunner";

const Execute = (): JSX.Element => {
  const snackbar = useSnackbar();
  const history = useHistory();
  const params = useParams<Params>();

  const [favorite, setFavorite] = useState(0);

  const scriptId = Number(params.scriptId);

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
      <ScriptRunner />
    </>
  );
};

export default Execute;
