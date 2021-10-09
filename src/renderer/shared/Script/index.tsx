import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  Drawer,
  Icon,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon
} from "@mui/material";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

type ScriptProps = {
  title: string;
  description: string;
};

const Script = (props: ScriptProps): JSX.Element => {
  return (
    <Card variant="outlined">
      <CardHeader
        title={props.title}
        titleTypographyProps={{ fontSize: 18, fontWeight: "400" }}
        subheader={props.description}
        action={
          <ButtonGroup size="small" variant="outlined">
            <Button>
              <Icon fontSize="small">delete</Icon>
            </Button>
            <Button>
              <Icon fontSize="small">edit</Icon>
            </Button>
            <Button>
              <Icon fontSize="small">play_arrow</Icon>
            </Button>
          </ButtonGroup>
        }
      />
    </Card>
  );
};

export default Script;
