import { Search } from "@mui/icons-material";
import { Box, InputAdornment, TextField } from "@mui/material";
import { ChangeEvent, useDeferredValue, useMemo, useState } from "react";
import AsyncContent from "../../components/AsyncContent";
import PageName from "../../components/PageName";
import ScriptList from "../../components/ScriptList";
import db from "../../database";
import { useDexieFetch } from "../../hooks/useDexieFetch";
import { Script } from "../../types/script";

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
      <PageName name="Search" />
      <AsyncContent status={status} error={error}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearchChange}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }
          }}
        />
        <Box sx={{ marginTop: 2 }}>
          <ScriptList scripts={filteredScripts} onReload={reload} />
        </Box>
      </AsyncContent>
    </>
  );
}

export default SearchScreen;
