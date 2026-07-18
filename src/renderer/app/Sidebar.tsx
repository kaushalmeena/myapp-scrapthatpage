import { FileSearch } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PAGE_LINKS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="flex w-16 shrink-0 flex-col items-center gap-1 border-r bg-card py-3">
      <Button
        variant="ghost"
        size="icon"
        title="Home"
        onClick={() => navigate("/")}
      >
        <FileSearch
          className={cn(
            "size-6",
            pathname === "/" ? "text-primary" : "text-muted-foreground"
          )}
        />
      </Button>
      <Separator className="my-2" />
      {PAGE_LINKS.map(({ title, route, Icon }) => (
        <Button
          key={route}
          variant="ghost"
          size="icon"
          title={title}
          onClick={() => navigate(route)}
        >
          <Icon
            className={cn(
              "size-5",
              pathname === route ? "text-primary" : "text-muted-foreground"
            )}
          />
        </Button>
      ))}
    </aside>
  );
}

export default Sidebar;
