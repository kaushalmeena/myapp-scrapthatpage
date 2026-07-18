import { createMemoryRouter } from "react-router-dom";
import MainLayout from "./MainLayout";
import HomeScreen from "@/features/home/HomeScreen";
import FavoritesScreen from "@/features/scripts/FavoritesScreen";
import SearchScreen from "@/features/scripts/SearchScreen";
import DeleteScreen from "@/features/scripts/DeleteScreen";
import CreateScreen from "@/features/editor/CreateScreen";
import UpdateScreen from "@/features/editor/UpdateScreen";
import ExecuteScreen from "@/features/runner/ExecuteScreen";
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
      { path: "/delete/:scriptId", element: <DeleteScreen /> },
      { path: "/execute/:scriptId", element: <ExecuteScreen /> }
    ]
  }
]);

export default router;
