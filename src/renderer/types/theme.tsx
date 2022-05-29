import { ThemeOptions } from "@mui/material";
import { THEME_TYPES } from "../constants/themes";

export type Theme = {
  name: string;
  data: ThemeOptions;
};

export type Themes = {
  [theme in THEME_TYPES]: Theme;
};
