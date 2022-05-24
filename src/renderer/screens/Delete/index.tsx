import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PageName from "../../components/PageName";
import { INITIAL_SCRIPT } from "../../constants/script";
import db from "../../database";
import { useNotification } from "../../hooks/useNotification";
import { PAGE_STATUS } from "../../types/page";
import { Params } from "../../types/router";
import { Script } from "../../types/script";

const Delete = (): JSX.Element => {
  const notification = useNotification();
  const navigate = useNavigate();
  const params = useParams<Params>();

  const [status, setStatus] = useState<PAGE_STATUS>("loading");
  const [script, setScript] = useState<Script>(INITIAL_SCRIPT);
  const [error, setError] = useState("");

  const scriptId = Number(params.scriptId);

  useEffect(() => {
    setStatus("loading");
    db.fetchScriptById(scriptId)
      .then((script) => {
        if (script) {
          setScript(script);
          setStatus("loaded");
        } else {
          setError("Script not found in database.");
          setStatus("error");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Error occurred while fetching.");
        setStatus("error");
      });
  }, []);

  const handleYesClick = () => {
    db.deleteScriptById(scriptId)
      .then(() => {
        notification.show("Script successfully deleted!", "success");
        navigate("/search");
      })
      .catch((err) => {
        console.error(err);
        notification.show("Error occurred while deleting.", "error");
      });
  };

  const handleNoClick = () => {
    navigate(-1);
  };

  return (
    <>
      <PageName name="Delete" />
      <Box display="flex" flexDirection="column" alignItems="center">
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
};

export default Delete;
