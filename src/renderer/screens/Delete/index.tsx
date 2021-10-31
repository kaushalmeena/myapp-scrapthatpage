import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { INITIAL_SCRIPT } from "../../constants/script";
import { deleteScript, fetchScript } from "../../database/main";
import { useSnackbar } from "../../hooks/useSnackbar";
import { PAGE_STATUS } from "../../types/layout";
import { Params } from "../../types/router";
import { Script } from "../../types/script";

const Delete = (): JSX.Element => {
  const { showSnackbar } = useSnackbar();

  const history = useHistory();
  const params = useParams<Params>();

  const [status, setStatus] = useState<PAGE_STATUS>("loading");
  const [script, setScript] = useState<Script>(INITIAL_SCRIPT);
  const [error, setError] = useState("");

  const id = Number(params.scriptId);

  useEffect(() => {
    setStatus("loading");
    fetchScript(id)
      .then((script) => {
        if (script) {
          setStatus("loaded");
          setScript(script);
        } else {
          setStatus("error");
          setError("Script not found in database.");
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
        setError("Error occured while loading script.");
      });
  }, []);

  const handleYesClick = () => {
    deleteScript(id)
      .then(() => {
        showSnackbar("Script successfully deleted!", "success");
        history.goBack();
      })
      .catch((err) => {
        console.error(err);
        showSnackbar("Error occured while deleting.", "error");
      });
  };

  const handleNoClick = () => {
    history.goBack();
  };

  return (
    <>
      <Typography fontSize={28} fontWeight="400">
        Delete
      </Typography>
      <Box
        marginY={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        {status === "loading" ? <CircularProgress /> : null}
        {status === "loaded" ? (
          <>
            <Typography variant="h6">
              Do you want to delete script <strong>{script.name}</strong> ?
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
        ) : null}
        {status === "error" ? (
          <Typography variant="h6">{error}</Typography>
        ) : null}
      </Box>
    </>
  );
};

export default Delete;
