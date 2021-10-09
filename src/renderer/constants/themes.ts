import { deepOrange, deepPurple, indigo, pink } from "@mui/material/colors";
import { IThemes } from "../interfaces/themes";

export const ThemeOptions = [
  {
    name: "Light",
    value: "light"
  },
  {
    name: "Dark",
    value: "dark"
  }
];

export const THEMES: IThemes = {
  light: {
    palette: {
      mode: "light",
      primary: indigo,
      secondary: pink
    }
  },
  dark: {
    palette: {
      mode: "dark",
      primary: deepPurple,
      secondary: deepOrange
    }
  }
};
