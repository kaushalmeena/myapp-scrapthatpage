import { SquarePlus } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const isMac = navigator.platform.toUpperCase().includes("MAC");

// Routes that don't appear in the sidebar map to the section they belong to,
// so the relevant nav item stays highlighted on detail screens.
const activeRouteFor = (pathname: string): string => {
  if (pathname === "/") {
    return "/";
  }
  if (
    pathname.startsWith("/create") ||
    pathname.startsWith("/update") ||
    pathname.startsWith("/execute") ||
    pathname.startsWith("/search")
  ) {
    return "/search";
  }
  const section = NAV_LINKS.find(
    ({ route }) => route !== "/" && pathname.startsWith(route)
  );
  return section?.route ?? "";
};

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const activeRoute = activeRouteFor(pathname);

  const handleCreateClick = () => navigate("/create");

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r bg-card">
      {/* Draggable brand strip; on macOS it also clears the traffic lights
          (hiddenInset title bar). */}
      <div
        className={cn(
          "app-region-drag flex items-center gap-2 px-4 pb-2",
          isMac ? "pt-9" : "pt-3"
        )}
      >
        <Logo className="size-7 rounded-[7px]" />
        <span className="text-sm font-semibold tracking-tight">
          ScrapThatPage
        </span>
      </div>

      <div className="px-3 py-2">
        <Button
          className="w-full justify-start gap-2"
          size="sm"
          onClick={handleCreateClick}
        >
          <SquarePlus className="size-4" />
          New script
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {NAV_LINKS.map(({ title, route, Icon }) => {
          const active = activeRoute === route;
          return (
            <button
              key={route}
              type="button"
              className={cn(
                "flex h-9 cursor-pointer items-center gap-2.5 rounded-md px-3 text-sm transition-colors",
                active
                  ? "bg-accent font-medium text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
              onClick={() => navigate(route)}
            >
              <Icon className="size-4 shrink-0" />
              {title}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
        <span>Quick actions</span>
        <kbd className="rounded border bg-muted px-1.5 py-0.5 font-sans text-[10px] font-medium">
          {isMac ? "⌘" : "Ctrl+"}K
        </kbd>
      </div>
    </aside>
  );
}
