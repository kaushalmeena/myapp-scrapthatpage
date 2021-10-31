import { Stack, TextField, Typography } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import { fetchAllScripts } from "../../database/main";
import { useSnackbar } from "../../hooks/useSnackbar";
import ScriptCard from "../../shared/ScriptCard";
import { Script } from "../../types/script";

const Search = (): JSX.Element => {
  const { showSnackbar } = useSnackbar();

  const [query, setQuery] = useState("");
  const [allScripts, setAllScripts] = useState<Script[]>([]);
  const [filteredScripts, setFilteredScripts] = useState<Script[]>([]);

  useEffect(() => {
    fetchAllScripts()
      .then((data) => {
        setAllScripts(data);
        setFilteredScripts(data);
      })
      .catch((err) => {
        console.error(err);
        showSnackbar("Error occured while fetching scripts", "error");
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
      <Typography marginBottom={1} fontSize={28} fontWeight="400">
        Search
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        value={query}
        onChange={handleQueryChange}
      />
      <Stack marginY={2} gap={1}>
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
          <Typography
            margin={1}
            textAlign="center"
            color="GrayText"
            variant="body2"
          >
            &lt; Empty &gt;
          </Typography>
        )}
      </Stack>
    </>
  );
};

export default Search;
