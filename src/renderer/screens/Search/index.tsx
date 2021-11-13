import { Icon, InputAdornment, Stack, TextField } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import EmptyText from "../../components/EmptyText";
import PageName from "../../components/PageName";
import ScriptCard from "../../components/ScriptCard";
import { fetchAllScripts } from "../../database/main";
import { useSnackbar } from "../../hooks/useSnackbar";
import { Script } from "../../types/script";

const Search = (): JSX.Element => {
  const snackbar = useSnackbar();

  const [scripts, setScripts] = useState<Script[]>([]);
  const [filteredScripts, setFilteredScripts] = useState<Script[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchAllScripts()
      .then((data) => {
        setScripts(data);
        setFilteredScripts(data);
      })
      .catch((err) => {
        console.error(err);
        snackbar.show("Error occured while fetching.", "error");
      });
  }, []);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    if (searchValue) {
      const searchQuery = query.toLowerCase();
      const filteredList = scripts.filter((item) =>
        item.name.toLowerCase().includes(searchQuery)
      );
      setFilteredScripts(filteredList);
    } else {
      setFilteredScripts(scripts);
    }
    setQuery(searchValue);
  };

  return (
    <>
      <PageName name="Search" />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        value={query}
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
              id={item.id}
              title={item.name}
              description={item.description}
            />
          ))
        ) : (
          <EmptyText />
        )}
      </Stack>
    </>
  );
};

export default Search;
