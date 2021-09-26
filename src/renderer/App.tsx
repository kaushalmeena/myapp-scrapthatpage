import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./screens/Home";
import Layout from "./layouts/Layout";
import { ThemeProvider } from "./context/Theme";

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CssBaseline />
        <Layout>
          <Switch>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
