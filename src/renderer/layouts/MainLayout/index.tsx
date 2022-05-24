import { Box, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { THEMES } from "../../constants/themes";
import { StoreRootState } from "../../types/store";
import Notification from "./Notification";
import Sidebar from "./Sidebar";

type MainLayoutProps = {
  children?: ReactNode;
};

const MainLayout = (props: MainLayoutProps): JSX.Element => {
  const theme = useSelector((state: StoreRootState) => state.settings.theme);

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
          {props.children}
        </Box>
      </Box>
      <Notification />
    </ThemeProvider>
  );
};

export default MainLayout;