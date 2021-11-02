import {
  Icon,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import { fetchAllScripts } from "../../database/main";
import { useSnackbar } from "../../hooks/useSnackbar";
import PageName from "../../shared/PageName";
import ScriptCard from "../../shared/ScriptCard";
import { Script } from "../../types/script";

const Search = (): JSX.Element => {
  const snackbar = useSnackbar();

  const [allScripts, setAllScripts] = useState<Script[]>([]);
  const [filteredScripts, setFilteredScripts] = useState<Script[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchAllScripts()
      .then((data) => {
        setAllScripts(data);
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
      const filteredList = allScripts.filter((item) =>
        item.name.toLowerCase().includes(searchQuery)
      );
      setFilteredScripts(filteredList);
    } else {
      setFilteredScripts(allScripts);
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
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Icon>search</Icon>
            </InputAdornment>
          )
        }}
        onChange={handleQueryChange}
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
          <Typography margin={1} textAlign="center" color="text.secondary">
            &lt; Empty &gt;
          </Typography>
        )}
      </Stack>
    </>
  );
};

export default Search;
