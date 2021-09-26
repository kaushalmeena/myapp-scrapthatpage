import MuiThemeProvider from "@mui/material/styles/ThemeProvider";
import React, { Component, createContext, ReactNode } from "react";
import { THEME_KEY } from "../../constants/settings";
import THEMES, { DEFAULT_THEME } from "../../constants/themes";

export const ThemeContext = createContext(null);

type ThemeProviderProps = {
  children?: ReactNode;
};

type ThemeProviderState = {
  themeId: string;
};

export class ThemeProvider extends Component<ThemeProviderProps, ThemeProviderState> {
  constructor(props: ThemeProviderProps) {
    super(props);
    this.state = {
      themeId: DEFAULT_THEME
    };
  }

  async componentDidMount(): Promise<void> {
    const themeId = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
    this.setState({
      themeId
    });
  }

  setTheme = (id: string): void => {
    this.setState({ themeId: id });
    localStorage.setItem(THEME_KEY, id);
  }

  render(): JSX.Element {
    const theme = THEMES[this.state.themeId];
    return (
      <ThemeContext.Provider value={{ themeId: this.state.themeId, setTheme: this.setTheme }}>
        <MuiThemeProvider theme={theme}>
          {this.props.children}
        </MuiThemeProvider>
      </ThemeContext.Provider>
    );
  }
}

export const ThemeConsumer = ThemeContext.Consumer;
