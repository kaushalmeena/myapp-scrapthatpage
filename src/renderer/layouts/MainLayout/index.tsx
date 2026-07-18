import { Box, createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { Outlet } from "react-router-dom";
import { THEMES } from "../../constants/themes";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectTheme } from "../../redux/slices/settingsSlice";
import Notification from "./Notification";
import Sidebar from "./Sidebar";

function MainLayout() {
  const themeType = useAppSelector(selectTheme);

  const themeData = THEMES[themeType].data;
  const muiTheme = createTheme(themeData);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box
          component="main"
          sx={{ padding: 2, flexGrow: 1, bgcolor: "background.default" }}
        >
          <Outlet />
        </Box>
      </Box>
      <Notification />
    </ThemeProvider>
  );
}

export default MainLayout;
