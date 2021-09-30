import { Theme } from "@mui/material";

export interface IThemes {
  [themeId: string]: Theme;
}

export interface IThemesOptions {
  id: string;
  name: string;
  color: string;
}