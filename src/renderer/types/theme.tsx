import { ThemeOptions } from "@mui/material";
import { THEME_TYPES } from "../constants/themes";

export type Theme = {
  name: string;
  type: THEME_TYPES;
  data: ThemeOptions;
};
