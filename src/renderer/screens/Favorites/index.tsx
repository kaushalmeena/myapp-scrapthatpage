import { Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { fetchAllFavoriteScripts } from "../../database/main";
import { useSnackbar } from "../../hooks/useSnackbar";
import PageName from "../../components/PageName";
import ScriptCard from "../../components/ScriptCard";
import { Script } from "../../types/script";

const Favorites = (): JSX.Element => {
  const snackbar = useSnackbar();

  const [scripts, setScripts] = useState<Script[]>([]);

  useEffect(() => {
    fetchAllFavoriteScripts()
      .then((data) => {
        setScripts(data);
      })
      .catch((err) => {
        console.error(err);
        snackbar.show("Error occured while fetching.", "error");
      });
  }, []);

  return (
    <>
      <PageName name="Favorites" />
      <Stack gap={1}>
        {scripts.length > 0 ? (
          scripts.map((item) => (
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

export default Favorites;
