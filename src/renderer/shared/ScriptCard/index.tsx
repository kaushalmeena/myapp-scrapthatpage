import {
  Box,
  Button,
  ButtonGroup,
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

type ScriptCardProps = {
  title: string;
  description: string;
};

const ScriptCard = (props: ScriptCardProps): JSX.Element => {
  return (
    <Card variant="outlined">
      <CardHeader
        title={props.title}
        subheader={props.description}
        action={
          <Stack direction="row">
            <IconButton color="primary">
              <Icon>delete</Icon>
            </IconButton>
            <IconButton color="primary">
              <Icon>edit</Icon>
            </IconButton>
            <IconButton color="primary">
              <Icon>play_arrow</Icon>
            </IconButton>
          </Stack>
        }
      />
    </Card>
  );
};

export default ScriptCard;
