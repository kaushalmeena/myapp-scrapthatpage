import {
  InputAdornment,
  Card,
  CardActionArea,
  CardHeader,
  Paper,
  TextField,
  Typography,
  Box,
  Button,
  Icon,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  OutlinedInput,
  Stack
} from "@mui/material";
import React from "react";
import { useHistory } from "react-router";
import Script from "../../shared/Script";

const Search = (): JSX.Element => {
  const history = useHistory();
  return (
    <>
      <Typography marginBottom={1} fontSize={28} fontWeight="400">
        Search
      </Typography>
      <OutlinedInput
        fullWidth
        size="small"
        startAdornment={
          <InputAdornment position="start">
            <Icon>search</Icon>
          </InputAdornment>
        }
      />
      <Stack marginY={2} gap={1}>
        <Script title="myscript" description="helloo aqdwd" />
        <Script title="myscript" description="helloo aqdwd" />
      </Stack>
    </>
  );
};

export default Search;
