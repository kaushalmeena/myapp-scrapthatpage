import { Button, Icon, Menu, MenuItem, Stack } from "@mui/material";
import React from "react";
import { TableData } from "../../../types";
import { downloadAsCSV, downloadAsJSON } from "../../../utils";

type ResultTableToolbarProps = {
  data: TableData;
};

function ResultTableToolbar({ data }: ResultTableToolbarProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

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
      paddingX={1}
      justifyContent="flex-end"
    >
      <Button startIcon={<Icon>file_download</Icon>} onClick={handledMenuOpen}>
        Export
      </Button>
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

export default ResultTableToolbar;
