import {
  Button,
  Icon,
  IconButton,
  Stack,
  Typography,
  Box
} from "@mui/material";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router";
import { updateFavoriteScriptField } from "../../database/main";
import { useSnackbar } from "../../hooks/useSnackbar";
import PageName from "../../shared/PageName";
import { Params } from "../../types/router";

const Execute = (): JSX.Element => {
  const { showSnackbar } = useSnackbar();

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
        showSnackbar("Error occured while updating.", "error");
      });
  };

  return (
    <>
      <PageName name="Execute" />
      <Box marginBottom={2} display="flex" justifyContent="space-between">
        <Stack direction="row" gap={1}>
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
        <IconButton
          color={favorite === 1 ? "secondary" : "primary"}
          onClick={handleFavouriteToogle}
        >
          <Icon>{favorite === 1 ? "favorite" : "favorite_border"}</Icon>
        </IconButton>
      </Box>
      <Typography variant="h5" textAlign="center">
        This is script name
      </Typography>
    </>
  );
};

export default Execute;
