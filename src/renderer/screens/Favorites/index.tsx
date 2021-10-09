import {
  InputAdornment,
  Paper,
  Stack,
  Typography,
  Box,
  Button
} from "@mui/material";
import React from "react";
import Script from "../../shared/Script";

const Favorites = (): JSX.Element => {
  return (
    <>
      <Typography fontSize={28} fontWeight="400">
        Favorites
      </Typography>
      <Stack gap={1} marginY={1}>
        <Script title="myscript" description="helloo aqdwd" />
        <Script title="myscript" description="helloo aqdwd" />
      </Stack>
    </>
  );
};

export default Favorites;
