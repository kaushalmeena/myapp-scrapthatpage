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
import React from "react";
import { useNavigate } from "react-router";
import { DRAWER_WIDTH, PAGE_LINKS } from "../../../constants/layout";

const Sidebar = (): JSX.Element => {
  const navigate = useNavigate();

  return (
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
        <IconButton color="primary" onClick={() => navigate("/dashboard")}>
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
            onClick={() => navigate(link.route)}
          >
            <ListItemIcon>
              <Icon>{link.icon}</Icon>
            </ListItemIcon>
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
