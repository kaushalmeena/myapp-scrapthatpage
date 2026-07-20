import { useLiveQuery } from "dexie-react-hooks";
import { Moon, Pencil, Play, SquarePlus, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command";
import db from "@/database";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { NAV_LINKS } from "@/lib/navigation";

// App-wide command palette on Cmd/Ctrl+K: navigation, quick actions, and
// per-script run/edit commands.
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.actions.setTheme);

  const scripts = useLiveQuery(() => db.getScripts(), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const runCommand = (action: () => void) => {
    setOpen(false);
    action();
  };

  const handleCreateSelect = () => runCommand(() => navigate("/create"));

  const handleToggleTheme = () =>
    runCommand(() => setTheme(theme === "dark" ? "light" : "dark"));

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {NAV_LINKS.map(({ title, route, Icon }) => (
            <CommandItem
              key={route}
              onSelect={() => runCommand(() => navigate(route))}
            >
              <Icon className="size-4" />
              {title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={handleCreateSelect}>
            <SquarePlus className="size-4" />
            New script
          </CommandItem>
          <CommandItem onSelect={handleToggleTheme}>
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
            Toggle theme
          </CommandItem>
        </CommandGroup>
        {scripts && scripts.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Scripts">
              {scripts.slice(0, 15).map((script) => (
                <CommandItem
                  key={`run-${script.id}`}
                  value={`run ${script.name}`}
                  onSelect={() =>
                    runCommand(() => navigate(`/execute/${script.id}`))
                  }
                >
                  <Play className="size-4" />
                  Run “{script.name}”
                </CommandItem>
              ))}
              {scripts.slice(0, 15).map((script) => (
                <CommandItem
                  key={`edit-${script.id}`}
                  value={`edit ${script.name}`}
                  onSelect={() =>
                    runCommand(() => navigate(`/update/${script.id}`))
                  }
                >
                  <Pencil className="size-4" />
                  Edit “{script.name}”
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
