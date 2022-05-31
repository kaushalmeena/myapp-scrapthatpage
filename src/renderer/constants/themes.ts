import { Themes } from "../types/theme";

export const enum ThemeTypes {
  DARK = "dark",
  LIGHT = "light"
}

export const THEMES: Themes = {
  [ThemeTypes.DARK]: {
    name: "Dark",
    data: {
      palette: {
        mode: "dark",
        primary: {
          contrastText: "#fff",
          dark: "rgb(23, 105, 170)",
          light: "rgb(77, 171, 245)",
          main: "#2196f3"
        },
        secondary: {
          contrastText: "rgba(0, 0, 0, 0.87)",
          dark: "rgb(0, 161, 82)",
          light: "rgb(51, 235, 145)",
          main: "#00e676"
        },
        background: {
          default: "#001E3C",
          paper: "#0A1929"
        }
      },
      components: {
        MuiListSubheader: {
          styleOverrides: {
            root: {
              backgroundColor: "#001E3C"
            }
          }
        }
      }
    }
  },
  [ThemeTypes.LIGHT]: {
    name: "Light",
    data: {
      palette: {
        mode: "light",
        primary: {
          main: "#3f51b5",
          light: "rgb(101, 115, 195)",
          dark: "rgb(44, 56, 126)",
          contrastText: "#fff"
        },
        secondary: {
          main: "#ff1744",
          light: "rgb(255, 69, 105)",
          dark: "rgb(178, 16, 47)",
          contrastText: "#fff"
        },
        background: {
          paper: "#fff",
          default: "#f5f8fa"
        }
      },
      components: {
        MuiListSubheader: {
          styleOverrides: {
            root: {
              backgroundColor: "#f5f8fa"
            }
          }
        }
      }
    }
  }
};
