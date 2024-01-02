import { Button, Menu, MenuItem, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { TableData } from "./types";
import { downloadAsCSV, downloadAsJSON } from "./utils";

type TableToolbarProps = {
  data: TableData;
};

function TableToolbar({ data }: TableToolbarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handledMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handledMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDownloadAsCSV = () => {
    downloadAsCSV(data);
  };

  const handleDownloadAsJSON = () => {
    downloadAsJSON(data);
  };

  return (
    <Stack
      direction="row"
      gap={1}
      paddingTop={1}
      paddingLeft={2}
      paddingRight={1}
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography variant="h6">Results</Typography>
      <Button onClick={handledMenuOpen}>Export</Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handledMenuClose}
      >
        <MenuItem onClick={handleDownloadAsCSV}>Download as CSV</MenuItem>
        <MenuItem onClick={handleDownloadAsJSON}>Download as JSON</MenuItem>
      </Menu>
    </Stack>
  );
}

export default TableToolbar;
