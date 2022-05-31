import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import React from "react";
import EmptyText from "../../components/EmptyText";
import PageName from "../../components/PageName";
import ScriptCard from "../../components/ScriptCard";
import db from "../../database";
import { useDatabaseFetch } from "../../hooks";
import { Script } from "../../types/script";

function Favorites() {
  const {
    result: scripts,
    status,
    error
  } = useDatabaseFetch<Script[]>(db.fetchAllFavoriteScripts(), []);

  return (
    <>
      <PageName name="Favorites" />
      <Box marginTop={2}>
        {status === "loading" && <CircularProgress />}
        {status === "loaded" && (
          <Stack gap={1}>
            {scripts.length > 0 ? (
              scripts.map((item) => (
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
        )}
        {status === "error" && <Typography variant="h6">{error}</Typography>}
      </Box>
    </>
  );
}

export default Favorites;
