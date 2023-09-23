import { ThemeOptions } from "@mui/material";

export type ThemeType = "dark" | "light";

export type Theme = {
  name: string;
  data: ThemeOptions;
};

export type Themes = Record<ThemeType, Theme>;
