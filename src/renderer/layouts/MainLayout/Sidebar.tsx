import { FindInPage } from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon
} from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { DRAWER_WIDTH, PAGE_LINKS } from "../../constants/layout";

function Sidebar() {
  const { pathname } = useLocation();
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
        <IconButton title="Home" onClick={() => navigate("/")}>
          <FindInPage
            color={pathname === "/" ? "primary" : "inherit"}
            fontSize="large"
          />
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
        {PAGE_LINKS.map(({ title, route, Icon }) => (
          <ListItemButton
            key={`li-${title}`}
            title={title}
            onClick={() => navigate(route)}
          >
            <ListItemIcon>
              <Icon color={pathname === route ? "primary" : "inherit"} />
            </ListItemIcon>
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
