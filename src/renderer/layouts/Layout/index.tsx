import { Box, Divider, Drawer, Icon, List, ListItem, ListItemButton, ListItemIcon } from "@mui/material";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { PAGE_LINKS } from "./constants";

const drawerWidth = 65;

type LayoutProps = {
  children?: ReactNode;
};

const Layout = (props: LayoutProps): JSX.Element => {
  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          }
        }}
      >
        <Box my={1} display="flex" justifyContent="center">
          <Icon color="primary" fontSize="large">find_in_page</Icon>
        </Box>
        <Divider />
        <List
          sx={{
            "& .MuiListItemIcon-root, .MuiListItemButton-root": {
              justifyContent: "center"
            }
          }}
        >
          {PAGE_LINKS.map((item) => (
            <ListItem
              disableGutters
              disablePadding
              key={`link-${item.name}`}
            >
              <ListItemButton
                disableGutters
                component={Link}
                title={item.name}
                to={item.href}
              >
                <ListItemIcon>
                  <Icon>{item.icon}</Icon>
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 2 }}
      >
        {props.children}
      </Box>
    </Box>
  );
}

export default Layout;
