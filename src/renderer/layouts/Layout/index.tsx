import {
  Box,
  Divider,
  Drawer,
  Icon,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon
} from "@mui/material";
import React, { ReactNode } from "react";
import { useHistory } from "react-router";
import { DRAWER_WIDTH, PAGE_LINKS } from "../../constants/layout";

type LayoutProps = {
  children?: ReactNode;
};

const Layout = (props: LayoutProps): JSX.Element => {
  const history = useHistory();
  return (
    <Box display="flex">
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box"
          }
        }}
      >
        <Box marginY={1} display="flex" justifyContent="center">
          <IconButton
            color="primary"
            onClick={() => history.push("/dashboard")}
          >
            <Icon color="primary" fontSize="large">
              find_in_page
            </Icon>
          </IconButton>
        </Box>
        <Divider />
        <List
          sx={{
            "& .MuiListItemButton-root, .MuiListItemIcon-root": {
              justifyContent: "center"
            }
          }}
        >
          {PAGE_LINKS.map((link) => (
            <ListItemButton
              key={`link-${link.title}`}
              title={link.title}
              onClick={() => history.push(link.route)}
            >
              <ListItemIcon>
                <Icon>{link.icon}</Icon>
              </ListItemIcon>
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box
        padding={2}
        flexGrow={1}
        bgcolor="background.default"
        component="main"
      >
        {props.children}
      </Box>
    </Box>
  );
};

export default Layout;
