import { Box, Divider, Drawer, Icon, IconButton, List, ListItem, ListItemButton, ListItemIcon } from "@mui/material";
import React, { ReactNode } from "react";
import { useHistory } from "react-router";
import { DRAWER_WIDTH, PAGE_LINKS } from "./constants";

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
            boxSizing: "border-box",
          }
        }}
      >
        <Box marginY={1} display="flex" justifyContent="center">
          <IconButton
            color="primary"
            onClick={() => history.push("/dashboard")}
          >
            <Icon color="primary" fontSize="large">find_in_page</Icon>
          </IconButton>
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
            <ListItemButton
              key={`link-${item.name}`}
              title={item.name}
              onClick={() => history.push(item.route)}
            >
              <ListItemIcon>
                <Icon>{item.icon}</Icon>
              </ListItemIcon>
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ padding: 2, flexGrow: 1, backgroundColor: "background.default" }}
      >
        {props.children}
      </Box>
    </Box>
  );
}

export default Layout;
