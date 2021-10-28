import { ThemeOptions } from "@mui/material";
import { THEME_TYPES } from "../constants/themes";

export interface ITheme {
  name: string;
  type: THEME_TYPES;
  data: ThemeOptions;
}
