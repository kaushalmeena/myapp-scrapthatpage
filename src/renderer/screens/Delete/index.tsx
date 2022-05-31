import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography
} from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router";
import PageName from "../../components/PageName";
import { INITIAL_SCRIPT } from "../../constants/script";
import db from "../../database";
import { useNotification } from "../../features/notification/hooks";
import { useDatabaseFetch } from "../../hooks";
import { Params } from "../../types/router";
import { Script } from "../../types/script";

function Delete() {
  const notification = useNotification();
  const navigate = useNavigate();
  const params = useParams<Params>();

  const scriptId = Number(params.scriptId);

  const {
    result: script,
    status,
    error
  } = useDatabaseFetch<Script>(db.fetchScriptById(scriptId), INITIAL_SCRIPT);

  const handleYesClick = () => {
    db.deleteScriptById(scriptId)
      .then(() => {
        notification.show("Script successfully deleted!", "success");
        navigate("/search");
      })
      .catch(() => {
        notification.show("Error occurred while deleting.", "error");
      });
  };

  const handleNoClick = () => {
    navigate(-1);
  };

  return (
    <>
      <PageName name="Delete" />
      <Box
        marginTop={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        {status === "loading" && <CircularProgress />}
        {status === "loaded" && (
          <>
            <Typography variant="h6">
              Do you want to delete {script.name} ?
            </Typography>
            <Stack direction="row" gap={2} marginTop={2}>
              <Button variant="outlined" onClick={handleYesClick}>
                Yes
              </Button>
              <Button variant="contained" onClick={handleNoClick}>
                No
              </Button>
            </Stack>
          </>
        )}
        {status === "error" && <Typography variant="h6">{error}</Typography>}
      </Box>
    </>
  );
}

export default Delete;
