import { InputAdornment, Paper, TextField, Typography, Box, Button, Icon } from "@mui/material";
import React from "react";

const Search = (): JSX.Element => {
  return (
    <>
      <Typography variant="h5">
        Search
      </Typography>
      <Box display="flex" justifyContent="flex-end" mt={1} mb={2}>
        <Button variant="contained" startIcon={<Icon>add</Icon>} >
          Create
        </Button>
      </Box>
      <Paper elevation={1}>
        <TextField
          fullWidth
          size="small"
          type="search"
          margin="none"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon>search</Icon>
              </InputAdornment>
            )
          }}
        />
      </Paper>
    </>
  )
};

export default Search;
