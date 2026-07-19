import { useLiveQuery } from "dexie-react-hooks";
import { FileUp, Search } from "lucide-react";
import {
  type ChangeEvent,
  useDeferredValue,
  useMemo,
  useRef,
  useState
} from "react";
import { toast } from "sonner";
import AsyncContent from "@/components/AsyncContent";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import db from "@/database";
import { TOAST_MESSAGES } from "@/lib/messages";
import ScriptList from "./ScriptList";
import { parseScriptImport } from "./scriptTransfer";

export default function SearchScreen() {
  const [search, setSearch] = useState("");
  // Defer the query so filtering doesn't block typing on large script lists.
  const query = useDeferredValue(search);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const scripts = useLiveQuery(() => db.getScripts(), []);

  const filteredScripts = useMemo(() => {
    if (!scripts) return [];
    if (!query) return scripts;
    // Case-insensitive substring match. Avoids `new RegExp(query)`, which throws
    // on invalid patterns (e.g. an unbalanced "(") typed into the search box.
    const needle = query.toLowerCase();
    return scripts.filter((item) => item.name.toLowerCase().includes(needle));
  }, [query, scripts]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    try {
      const imported = parseScriptImport(await file.text());
      await db.createScript(imported);
      toast.success(TOAST_MESSAGES.SCRIPT_IMPORT_SUCCESS);
    } catch {
      toast.error(TOAST_MESSAGES.SCRIPT_IMPORT_FAILURE);
    } finally {
      // Reset so re-selecting the same file fires onChange again.
      event.target.value = "";
    }
  };

  return (
    <>
      <PageHeader
        title="Scripts"
        subtitle={
          scripts
            ? `${scripts.length} ${scripts.length === 1 ? "script" : "scripts"}`
            : undefined
        }
        actions={
          <Button variant="outline" size="sm" onClick={handleImportClick}>
            <FileUp className="size-4" />
            Import
          </Button>
        }
      />
      <input
        type="file"
        accept="application/json,.json"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImportFileChange}
      />
      <AsyncContent status={scripts === undefined ? "loading" : "loaded"}>
        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search scripts by name…"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="mt-4">
          <ScriptList scripts={filteredScripts} />
        </div>
      </AsyncContent>
    </>
  );
}
