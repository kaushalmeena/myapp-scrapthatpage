import { Typography } from "@mui/material";
import React from "react";

type PageNameProps = {
  name: string;
};

const PageName = (props: PageNameProps): JSX.Element => {
  return (
    <Typography component="div" marginBottom={2} fontSize={28} fontWeight="400">
      {props.name}
    </Typography>
  );
};

export default PageName;
