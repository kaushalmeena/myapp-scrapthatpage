import { ThemeOptions } from "@mui/material";

export type Theme = {
  name: string;
  data: ThemeOptions;
};

export type Themes = {
  [key: string]: Theme;
};
