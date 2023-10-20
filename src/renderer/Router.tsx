import { createMemoryRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Create from "./screens/Create";
import Dashboard from "./screens/Dashboard";
import Delete from "./screens/Delete";
import Execute from "./screens/Execute";
import Favorites from "./screens/Favorites";
import Search from "./screens/Search";
import Settings from "./screens/Settings";
import Update from "./screens/Update";

const router = createMemoryRouter([
  {
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/favorites",
        element: <Favorites />
      },
      {
        path: "/search",
        element: <Search />
      },
      {
        path: "/settings",
        element: <Settings />
      },
      {
        path: "/create",
        element: <Create />
      },
      {
        path: "/update/:scriptId",
        element: <Update />
      },
      {
        path: "/delete/:scriptId",
        element: <Delete />
      },
      {
        path: "/execute/:scriptId",
        element: <Execute />
      }
    ]
  }
]);

export default router;
