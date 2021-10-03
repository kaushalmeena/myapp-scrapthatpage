import { Box, Icon, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Typography } from "@mui/material";
import React from "react";
import { useHistory } from "react-router";
import { DASHBOARD_CARDS } from "./constants";


const Dashboard = (): JSX.Element => {
  const history = useHistory();
  return (
    <>
      <Typography fontSize={28} fontWeight="400">
        Dashboard
      </Typography>
      <Box
        marginTop={2}
        display="flex"
        flexDirection="row"
      >
        <Box flex={2}>
          {DASHBOARD_CARDS.map((card) => (
            <List disablePadding key={`card-${card.title}`}>
              <ListItemButton onClick={() => history.push(card.route)}>
                <ListItemIcon>
                  <Icon fontSize="large">{card.icon}</Icon>
                </ListItemIcon>
                <ListItemText
                  primary={card.title}
                  secondary={card.subtitle}
                />
              </ListItemButton>
            </List>
          ))}
        </Box>
        <Box marginX={2} display="flex" flexDirection="row" flex={1}>
          <Icon sx={{ color: "primary.main", fontSize: 84 }}>find_in_page</Icon>
          <Box>
            <Typography variant="h5">ScrapThatPage!</Typography>
            <Typography variant="subtitle1">v{process.env.npm_package_version}</Typography>
          </Box>
        </Box>
      </Box>
      <Box
        marginTop={2}
        display="flex"
        flexDirection="row"
      >
        <Box flex={1}>
          <List
            dense
            subheader={
              <ListSubheader>
                Unsaved Scripts
              </ListSubheader>
            }
          >
            <ListItemButton>
              <ListItemText primary="My script 1" />
            </ListItemButton>
          </List>
        </Box>
        <Box flex={1}>
          <List
            dense
            subheader={
              <ListSubheader>
                Recent Scripts
              </ListSubheader>
            }
          >
            <ListItemButton>
              <ListItemText primary="My script 1" />
            </ListItemButton>
          </List>
        </Box>
      </Box>
    </>
  )
};

export default Dashboard;
