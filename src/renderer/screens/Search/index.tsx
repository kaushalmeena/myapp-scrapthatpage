import {
  Box,
  CircularProgress,
  Icon,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import EmptyText from "../../components/EmptyText";
import PageName from "../../components/PageName";
import ScriptCard from "../../components/ScriptCard";
import db from "../../database";
import { useDatabaseFetch } from "../../hooks";
import { Script } from "../../types/script";

function Search() {
  const [search, setSearch] = useState("");
  const {
    result: scripts,
    status,
    error
  } = useDatabaseFetch<Script[]>(db.fetchAllScripts(), []);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const searchQuery = search.toLowerCase();
  const filteredScripts = scripts.filter((item) =>
    item.name.toLowerCase().includes(searchQuery)
  );

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
              onChange={handleQueryChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>search</Icon>
                  </InputAdornment>
                )
              }}
            />
            <Stack marginTop={2} gap={1}>
              {filteredScripts.length > 0 ? (
                filteredScripts.map((item) => (
                  <ScriptCard
                    key={`script-${item.id}`}
                    id={item.id as number}
                    title={item.name}
                    description={item.description}
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

export default Search;
