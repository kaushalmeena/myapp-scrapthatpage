import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import PageName from "../../components/PageName";
import { INITIAL_SCRIPT } from "../../constants/script";
import { TOAST_MESSAGES } from "../../constants/toast";
import db from "../../database";
import { useDexieFetch } from "../../hooks/useDexieFetch";
import { useNotification } from "../../hooks/useNotification";
import { Script } from "../../types/script";

function DeleteScreen() {
  const notification = useNotification();
  const navigate = useNavigate();
  const params = useParams();

  const scriptId = Number(params.scriptId);

  const {
    result: script,
    status,
    error
  } = useDexieFetch<Script>({
    fetcher: db.fetchScriptById(scriptId),
    defaultValue: INITIAL_SCRIPT
  });

  const handleYesClick = () => {
    db.deleteScriptById(scriptId)
      .then(() => {
        notification.show(TOAST_MESSAGES.SCRIPT_DELETE_SUCCESS, "success");
        navigate("/search");
      })
      .catch(() => {
        notification.show(TOAST_MESSAGES.SCRIPT_DELETE_FAILURE, "error");
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

export default DeleteScreen;
