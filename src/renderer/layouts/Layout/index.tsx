import { FindInPage, } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SettingsIcon from "@mui/icons-material/Settings";
import ListIcon from "@mui/icons-material/List";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { ReactNode } from "react";

const drawerWidth = 240;

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
          },
        }}
      >
        <Toolbar>
          <FindInPage color="primary" fontSize="large" />
          <Typography variant="h6" color="inherit" ml={1}>
            ScrapThatPage
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary="All Scripts" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <FavoriteIcon />
            </ListItemIcon>
            <ListItemText primary="Favourites" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.paper", p: 3 }}
      >
        {props.children}
      </Box>
    </Box>
  );
}

export default Layout;
