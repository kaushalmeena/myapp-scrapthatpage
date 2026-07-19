import {
  Heart,
  History,
  House,
  Library,
  type LucideIcon,
  Settings
} from "lucide-react";

export type PageLink = {
  title: string;
  subtitle: string;
  route: string;
  Icon: LucideIcon;
};

// Main navigation, in sidebar order. Subtitles surface in the command palette
// and dashboard as short explanations of where each page leads.
export const NAV_LINKS: PageLink[] = [
  {
    title: "Home",
    subtitle: "Overview and quick actions",
    route: "/",
    Icon: House
  },
  {
    title: "Scripts",
    subtitle: "Browse, search and import your scripts",
    route: "/search",
    Icon: Library
  },
  {
    title: "Favorites",
    subtitle: "Scripts you marked as favorite",
    route: "/favorites",
    Icon: Heart
  },
  {
    title: "History",
    subtitle: "Past runs and their results",
    route: "/history",
    Icon: History
  },
  {
    title: "Settings",
    subtitle: "Theme and scraping preferences",
    route: "/settings",
    Icon: Settings
  }
];
