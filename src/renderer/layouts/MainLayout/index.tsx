import { Box, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React, { ReactNode } from "react";
import { THEMES } from "../../constants/themes";
import Notification from "../../features/notification/AppNotification";
import { useAppSelector } from "../../hooks";
import Sidebar from "./Sidebar";

type MainLayoutProps = {
  children: ReactNode;
};

function MainLayout({ children }: MainLayoutProps) {
  const theme = useAppSelector((state) => state.settings.theme);

  const themeData = THEMES[theme].data;
  const muiTheme = createTheme(themeData);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box display="flex">
        <Sidebar />
        <Box
          padding={2}
          flexGrow={1}
          bgcolor="background.default"
          component="main"
        >
          {children}
        </Box>
      </Box>
      <Notification />
    </ThemeProvider>
  );
}

export default MainLayout;
