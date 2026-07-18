import { useLiveQuery } from "dexie-react-hooks";
import { FileSearch, Moon, Pencil, Play, Sun } from "lucide-react";
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
import { PAGE_LINKS } from "@/lib/navigation";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectTheme, updateTheme } from "@/features/settings/settingsSlice";

// App-wide command palette on Cmd/Ctrl+K: navigation, quick actions, and
// per-script run/edit commands.
function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  const scripts = useLiveQuery(() => db.fetchAllScripts(), []);

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

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
            <FileSearch className="size-4" />
            Home
          </CommandItem>
          {PAGE_LINKS.map(({ title, route, Icon }) => (
            <CommandItem
              key={route}
              onSelect={() => runCommand(() => navigate(route))}
            >
              <Icon className="size-4" />
              {title}
            </CommandItem>
          ))}
          <CommandItem onSelect={() => runCommand(() => navigate("/history"))}>
            <Play className="size-4" />
            History
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() =>
              runCommand(() =>
                dispatch(updateTheme(theme === "dark" ? "light" : "dark"))
              )
            }
          >
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

export default CommandPalette;
