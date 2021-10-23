import {
  InputAdornment,
  Paper,
  Stack,
  Typography,
  Box,
  Button
} from "@mui/material";
import React from "react";
import ScriptCard from "../../shared/ScriptCard";

const Favorites = (): JSX.Element => {
  return (
    <>
      <Typography fontSize={28} fontWeight="400">
        Favorites
      </Typography>
      <Stack gap={1} marginY={1}>
        <ScriptCard title="myscript" description="helloo aqdwd" />
        <ScriptCard title="myscript" description="helloo aqdwd" />
      </Stack>
    </>
  );
};

export default Favorites;
