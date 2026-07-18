import { Box, CircularProgress, Typography } from "@mui/material";
import { ReactNode } from "react";
import { FetchStatus } from "../../hooks/useDexieFetch";

type AsyncContentProps = {
  status: FetchStatus;
  error: string;
  children: ReactNode;
};

// Renders the shared loading spinner / error message for a data fetch and shows
// its children only once loaded. Centralizes the status handling that every
// data-backed screen would otherwise repeat.
function AsyncContent({ status, error, children }: AsyncContentProps) {
  if (status === "loaded") {
    return <>{children}</>;
  }

  return (
    <Box
      sx={{
        marginTop: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      {status === "loading" && <CircularProgress />}
      {status === "error" && <Typography variant="h6">{error}</Typography>}
    </Box>
  );
}

export default AsyncContent;
