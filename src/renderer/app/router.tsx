import { createMemoryRouter } from "react-router-dom";
import MainLayout from "./MainLayout";
import HomeScreen from "@/features/home/HomeScreen";
import FavoritesScreen from "@/features/scripts/FavoritesScreen";
import SearchScreen from "@/features/scripts/SearchScreen";
import CreateScreen from "@/features/editor/CreateScreen";
import UpdateScreen from "@/features/editor/UpdateScreen";
import ExecuteScreen from "@/features/runner/ExecuteScreen";
import HistoryScreen from "@/features/history/HistoryScreen";
import RunDetailScreen from "@/features/history/RunDetailScreen";
import SettingsScreen from "@/features/settings/SettingsScreen";

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
      { path: "/history/:runId", element: <RunDetailScreen /> }
    ]
  }
]);

export default router;
