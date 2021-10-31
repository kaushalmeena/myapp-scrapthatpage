import { Box, CircularProgress } from "@mui/material";
import React from "react";

const PageLoader = (): JSX.Element => {
  return (
    <Box
      sx={{
        height: "calc(100vh - 32px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default PageLoader;
