import { createMemoryRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import CreateScreen from "./screens/Create";
import HomeScreen from "./screens/Home";
import DeleteScreen from "./screens/Delete";
import ExecuteScreen from "./screens/Execute";
import FavoritesScreen from "./screens/Favorites";
import SearchScreen from "./screens/Search";
import SettingsScreen from "./screens/Settings";
import UpdateScreen from "./screens/Update";

const router = createMemoryRouter([
  {
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomeScreen />
      },
      {
        path: "/favorites",
        element: <FavoritesScreen />
      },
      {
        path: "/search",
        element: <SearchScreen />
      },
      {
        path: "/settings",
        element: <SettingsScreen />
      },
      {
        path: "/create",
        element: <CreateScreen />
      },
      {
        path: "/update/:scriptId",
        element: <UpdateScreen />
      },
      {
        path: "/delete/:scriptId",
        element: <DeleteScreen />
      },
      {
        path: "/execute/:scriptId",
        element: <ExecuteScreen />
      }
    ]
  }
]);

export default router;
