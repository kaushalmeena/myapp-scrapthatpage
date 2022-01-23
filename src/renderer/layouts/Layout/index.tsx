import { Box, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { THEMES } from "../../constants/themes";
import { RootState } from "../../types/store";
import Sidebar from "./Sidebar";

type LayoutProps = {
  children?: ReactNode;
};

const Layout = (props: LayoutProps): JSX.Element => {
  const theme = useSelector((state: RootState) => state.settings.theme);

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
    </ThemeProvider>
  );
};

export default Layout;
