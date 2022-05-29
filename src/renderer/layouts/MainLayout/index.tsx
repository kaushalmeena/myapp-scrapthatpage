import { Box, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React, { ReactNode } from "react";
import { connect, MapStateToProps } from "react-redux";
import { THEMES, THEME_TYPES } from "../../constants/themes";
import Notification from "../../features/notification/AppNotification";
import { StoreRootState } from "../../types/store";
import Sidebar from "./Sidebar";

type MainLayoutStateProps = {
  theme: THEME_TYPES;
};

type MainLayoutOwnProps = {
  children?: ReactNode;
};

type MainLayoutProps = MainLayoutStateProps & MainLayoutOwnProps;

const MainLayout = (props: MainLayoutProps): JSX.Element => {
  const themeData = THEMES[props.theme].data;
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

const mapStateToProps: MapStateToProps<
  MainLayoutStateProps,
  MainLayoutOwnProps,
  StoreRootState
> = (state) => ({
  theme: state.settings.theme
});

export default connect(mapStateToProps)(MainLayout);
