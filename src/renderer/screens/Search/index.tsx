import { Search } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { ChangeEvent, useDeferredValue, useMemo, useState } from "react";
import EmptyText from "../../components/EmptyText";
import PageName from "../../components/PageName";
import ScriptCard from "../../components/ScriptCard";
import db from "../../database";
import { useDexieFetch } from "../../hooks/useDexieFetch";
import { Script } from "../../types/script";

function SearchScreen() {
  const [search, setSearch] = useState("");
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
    const regexp = new RegExp(query, "i");
    if (query) {
      return scripts.filter((item) => regexp.test(item.name));
    }
    return scripts;
  }, [query, scripts]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <>
      <PageName name="Search" />
      <Box marginTop={2}>
        {status === "loading" && <CircularProgress />}
        {status === "loaded" && (
          <>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
            />
            <Stack marginTop={2} gap={1}>
              {filteredScripts.length > 0 ? (
                filteredScripts.map((item) => (
                  <ScriptCard
                    key={`script-${item.id}`}
                    script={item}
                    onReload={reload}
                  />
                ))
              ) : (
                <EmptyText />
              )}
            </Stack>
          </>
        )}
        {status === "error" && <Typography variant="h6">{error}</Typography>}
      </Box>
    </>
  );
}

export default SearchScreen;
