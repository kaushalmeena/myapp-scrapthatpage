import {
  Box,
  CardContent,
  Collapse,
  Card,
  CardHeader,
  Drawer,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack
} from "@mui/material";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

type OperationCardProps = {};

const OperationCard = (props: OperationCardProps): JSX.Element => {
  const [expanded, setExpanded] = React.useState<boolean>(false);

  function handleExpandToogle() {
    setExpanded((state) => !state);
  }

  return (
    <Card variant="outlined">
      <CardHeader
        title={"OPEEN"}
        subheader={"sdsdgsgjsdkgskdgskg"}
        action={
          <Stack direction="row">
            <IconButton color="primary">
              <Icon>arrow_upward</Icon>
            </IconButton>
            <IconButton color="primary">
              <Icon>arrow_downward</Icon>
            </IconButton>
            <IconButton color="primary" onClick={handleExpandToogle}>
              <Icon>{expanded ? "edit" : "border_color"}</Icon>
            </IconButton>
            <IconButton color="secondary">
              <Icon>clear</Icon>
            </IconButton>
          </Stack>
        }
      />
      <Collapse in={expanded} timeout="auto">
        <CardContent>this is content</CardContent>
      </Collapse>
    </Card>
  );
};

export default OperationCard;
