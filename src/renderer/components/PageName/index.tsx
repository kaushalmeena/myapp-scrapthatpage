import { Typography } from "@mui/material";
import React from "react";

type PageNameProps = {
  name: string;
};

function PageName({ name }: PageNameProps) {
  return (
    <Typography component="div" marginBottom={2} fontSize={28} fontWeight="400">
      {name}
    </Typography>
  );
}

export default PageName;
