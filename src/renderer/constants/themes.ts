import { createTheme } from "@mui/material";

export const LIGHT_THEME = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3949ab"
    },
    secondary: {
      main: "#d81b60"
    }
  }
});

export const DARK_THEME = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#5f6478"
    },
    secondary: {
      main: "#f50057"
    }
  }
});
