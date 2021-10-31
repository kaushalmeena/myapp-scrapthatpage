import { Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { fetchAllFavoriteScripts } from "../../database/main";
import { useSnackbar } from "../../hooks/useSnackbar";
import ScriptCard from "../../shared/ScriptCard";
import { Script } from "../../types/script";

const Favorites = (): JSX.Element => {
  const { showSnackbar } = useSnackbar();

  const [scripts, setScripts] = useState<Script[]>([]);

  useEffect(() => {
    fetchAllFavoriteScripts()
      .then((data) => {
        setScripts(data);
      })
      .catch((err) => {
        console.error(err);
        showSnackbar("Error occured while fetching.", "error");
      });
  }, []);

  return (
    <>
      <Typography marginBottom={1} fontSize={28} fontWeight="400">
        Favorites
      </Typography>
      <Stack marginY={2} gap={1}>
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
          <Typography margin={1} textAlign="center" color="GrayText">
            &lt; Empty &gt;
          </Typography>
        )}
      </Stack>
    </>
  );
};

export default Favorites;
