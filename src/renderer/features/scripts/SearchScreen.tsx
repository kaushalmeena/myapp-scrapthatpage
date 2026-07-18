import { Search } from "lucide-react";
import { ChangeEvent, useDeferredValue, useMemo, useState } from "react";
import AsyncContent from "@/components/AsyncContent";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import db from "@/database";
import { useDexieFetch } from "@/hooks/useDexieFetch";
import { Script } from "@/types/script";
import ScriptList from "./ScriptList";

function SearchScreen() {
  const [search, setSearch] = useState("");
  // Defer the query so filtering doesn't block typing on large script lists.
  const query = useDeferredValue(search);

  const {
    result: scripts,
    status,
    error,
    reload
  } = useDexieFetch<Script[]>({
    fetcher: () => db.fetchAllScripts(),
    defaultValue: []
  });

  const filteredScripts = useMemo(() => {
    if (!query) {
      return scripts;
    }
    // Case-insensitive substring match. Avoids `new RegExp(query)`, which throws
    // on invalid patterns (e.g. an unbalanced "(") typed into the search box.
    const needle = query.toLowerCase();
    return scripts.filter((item) => item.name.toLowerCase().includes(needle));
  }, [query, scripts]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <>
      <PageHeader title="Search" />
      <AsyncContent status={status} error={error}>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search scripts…"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="mt-4">
          <ScriptList scripts={filteredScripts} onReload={reload} />
        </div>
      </AsyncContent>
    </>
  );
}

export default SearchScreen;
