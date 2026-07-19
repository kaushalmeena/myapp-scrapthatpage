import { createMemoryRouter } from "react-router-dom";
import CreateScreen from "@/features/editor/CreateScreen";
import UpdateScreen from "@/features/editor/UpdateScreen";
import HistoryScreen from "@/features/history/HistoryScreen";
import LogsScreen from "@/features/history/LogsScreen";
import HomeScreen from "@/features/home/HomeScreen";
import ExecuteScreen from "@/features/runner/ExecuteScreen";
import FavoritesScreen from "@/features/scripts/FavoritesScreen";
import SearchScreen from "@/features/scripts/SearchScreen";
import SettingsScreen from "@/features/settings/SettingsScreen";
import MainLayout from "./MainLayout";

const router = createMemoryRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <HomeScreen /> },
      { path: "/favorites", element: <FavoritesScreen /> },
      { path: "/search", element: <SearchScreen /> },
      { path: "/settings", element: <SettingsScreen /> },
      { path: "/create", element: <CreateScreen /> },
      { path: "/update/:scriptId", element: <UpdateScreen /> },
      { path: "/execute/:scriptId", element: <ExecuteScreen /> },
      { path: "/history", element: <HistoryScreen /> },
      { path: "/history/:runId", element: <LogsScreen /> }
    ]
  }
]);

export default router;
