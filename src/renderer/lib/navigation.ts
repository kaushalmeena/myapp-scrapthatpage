import { Heart, LucideIcon, Search, Settings, SquarePlus } from "lucide-react";

export type PageLink = {
  title: string;
  subtitle: string;
  route: string;
  Icon: LucideIcon;
};

export const PAGE_LINKS: PageLink[] = [
  {
    title: "Create",
    subtitle: "Create a new script",
    route: "/create",
    Icon: SquarePlus
  },
  {
    title: "Favorites",
    subtitle: "List your favorite scripts",
    route: "/favorites",
    Icon: Heart
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
