export const enum PAGE_STATES {
  LOADING,
  LOADED,
  ERROR
}

export const DRAWER_WIDTH = 70;

export const PAGE_LINKS = [
  {
    title: "Create",
    subtitle: "Create a new script.",
    route: "/create",
    icon: "dashboard_customize"
  },
  {
    title: "Favorites",
    subtitle: "List your favorites scripts.",
    route: "/favorites",
    icon: "favorite"
  },
  {
    title: "Search",
    subtitle: "Search scripts using a query.",
    route: "/search",
    icon: "search"
  },
  {
    title: "Settings",
    subtitle: "Show app settings.",
    route: "/settings",
    icon: "settings"
  }
];
