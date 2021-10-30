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
import { getAllScripts } from "../../database/main";
import ScriptCard from "../../shared/ScriptCard";

const Search = (): JSX.Element => {

  const history = useHistory();

  const fetchDocs = () => {
    getAllScripts().then((res) => {
      console.log(res);
    });
  }

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
      <Button onClick={fetchDocs}>Fetch</Button>
      <Stack marginY={2} gap={1}>
        <ScriptCard title="myscript" description="helloo aqdwd" />
        <ScriptCard title="myscript" description="helloo aqdwd" />
      </Stack>
    </>
  );
};

export default Search;
