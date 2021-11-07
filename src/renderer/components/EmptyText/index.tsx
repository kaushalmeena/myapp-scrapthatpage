import { Typography } from "@mui/material";
import React from "react";

const EmptyText = (): JSX.Element => {
  return (
    <Typography margin={1} textAlign="center" color="text.secondary">
      &lt; Empty &gt;
    </Typography>
  );
};

export default EmptyText;
