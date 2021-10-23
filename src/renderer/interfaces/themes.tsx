import { ThemeOptions } from "@mui/material";

export interface IThemeOptions {
  name: string;
  value: string;
}

export interface IThemes {
  [key: string]: ThemeOptions;
}
