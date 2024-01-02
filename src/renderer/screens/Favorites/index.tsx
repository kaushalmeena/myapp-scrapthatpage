import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import EmptyText from "../../components/EmptyText";
import PageName from "../../components/PageName";
import ScriptCard from "../../components/ScriptCard";
import db from "../../database";
import { useDexieFetch } from "../../hooks/useDexieFetch";
import { Script } from "../../types/script";

function FavoritesScreen() {
  const {
    result: scripts,
    status,
    error,
    reload
  } = useDexieFetch<Script[]>({
    fetcher: () => db.fetchAllFavoriteScripts(),
    defaultValue: []
  });

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
                  script={item}
                  onReload={reload}
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

export default FavoritesScreen;
