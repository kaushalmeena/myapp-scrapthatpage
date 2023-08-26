import { Box } from "@mui/material";
import PageName from "../../components/PageName";
import AppSettings from "../../features/settings/AppSettings";

function Settings() {
  return (
    <>
      <PageName name="Settings" />
      <Box maxWidth={500}>
        <AppSettings />
      </Box>
    </>
  );
}

export default Settings;
