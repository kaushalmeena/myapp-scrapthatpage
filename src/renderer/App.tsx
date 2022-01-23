import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import { MemoryRouter, Redirect, Route, Switch } from "react-router-dom";
import { SettingsProvider } from "./context/Settings";
import { SnackbarProvider } from "./context/Snackbar";
import Layout from "./layouts/Layout";
import Create from "./screens/Create";
import Dashboard from "./screens/Dashboard";
import Delete from "./screens/Delete";
import Execute from "./screens/Execute";
import Favorites from "./screens/Favorites";
import Search from "./screens/Search";
import Settings from "./screens/Settings";
import Update from "./screens/Update";

const App = (): JSX.Element => {
  return (
    <SnackbarProvider>
      <SettingsProvider>
        <CssBaseline />
        <MemoryRouter>
          <Layout>
            <Switch>
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/favorites" component={Favorites} />
              <Route path="/search" component={Search} />
              <Route path="/settings" component={Settings} />
              <Route path="/create" component={Create} />
              <Route path="/update/:scriptId" component={Update} />
              <Route path="/delete/:scriptId" component={Delete} />
              <Route path="/execute/:scriptId" component={Execute} />
              <Route exact path="/">
                <Redirect to="/dashboard" />
              </Route>
            </Switch>
          </Layout>
        </MemoryRouter>
      </SettingsProvider>
    </SnackbarProvider>
  );
};

export default App;
