import { createTheme } from "@mui/material";
import indigo from "@mui/material/colors/indigo";
import pink from "@mui/material/colors/pink";
import Themes from "../interfaces/themes";

export const DEFAULT_THEME = "th001";

export const THEME_OPTIONS = [
  {
    id: "th001",
    name: "Indigo",
    color: indigo[400]
  },
  {
    id: "th002",
    name: "Dark",
    color: indigo[700]
  }
];

const THEMES: Themes = {
  th001: createTheme({
    palette: {
      mode: "light",
      primary: indigo,
      secondary: pink
    }
  }),
  th002: createTheme({
    palette: {
      mode: "light",
      primary: indigo,
      secondary: pink
    }
  })
};

export default THEMES;