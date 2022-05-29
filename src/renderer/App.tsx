import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes, Navigate } from "react-router-dom";
import { PersistGate } from "redux-persist/es/integration/react";
import MainLayout from "./layouts/MainLayout";
import Create from "./screens/Create";
import Dashboard from "./screens/Dashboard";
import Delete from "./screens/Delete";
import Execute from "./screens/Execute";
import Favorites from "./screens/Favorites";
import Search from "./screens/Search";
import Settings from "./screens/Settings";
import Update from "./screens/Update";
import store, { persistor } from "./store";

const App = (): JSX.Element => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MemoryRouter>
          <MainLayout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/search" element={<Search />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/create" element={<Create />} />
              <Route path="/update/:scriptId" element={<Update />} />
              <Route path="/delete/:scriptId" element={<Delete />} />
              <Route path="/execute/:scriptId" element={<Execute />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </MainLayout>
        </MemoryRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;
