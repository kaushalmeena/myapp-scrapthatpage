import { PageLink } from "../types/layout";
import {
  DashboardCustomize,
  Favorite,
  Search,
  Settings
} from "@mui/icons-material";

export const DRAWER_WIDTH = 70;

export const PAGE_LINKS: PageLink[] = [
  {
    title: "Create",
    subtitle: "Create a new script",
    route: "/create",
    Icon: DashboardCustomize
  },
  {
    title: "Favorites",
    subtitle: "List your favorites scripts",
    route: "/favorites",
    Icon: Favorite
  },
  {
    title: "Search",
    subtitle: "Search scripts using a query",
    route: "/search",
    Icon: Search
  },
  {
    title: "Settings",
    subtitle: "Show app settings",
    route: "/settings",
    Icon: Settings
  }
];
