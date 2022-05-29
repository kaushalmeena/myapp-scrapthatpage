import { Box } from "@mui/material";
import React from "react";
import PageName from "../../components/PageName";
import AppSettings from "../../features/settings/AppSettings";

const Settings = (): JSX.Element => {
  return (
    <>
      <PageName name="Settings" />
      <Box maxWidth={500}>
        <AppSettings />
      </Box>
    </>
  );
};

export default Settings;
