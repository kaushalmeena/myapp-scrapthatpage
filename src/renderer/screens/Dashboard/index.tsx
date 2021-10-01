import { Box, Button, Card, CardActionArea, CardHeader, Icon, InputAdornment, List, ListItemButton, ListItemIcon, ListItemText, Paper, TextField, Typography } from "@mui/material";
import React from "react";
import { useHistory } from "react-router";
import { DASHBOARD_CARDS } from "./constants";

const Dashboard = (): JSX.Element => {
  const history = useHistory();
  return (
    <>
      <Typography variant="h5">
        Dashboard
      </Typography>
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: { xs: 'column', md: 'row' }
        }}
      >
        <Box flex={{ xs: 1, md: 2 }}>
          {DASHBOARD_CARDS.map((card) => (
            <List disablePadding>
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
        <Box flex={{ xs: 1, md: 1 }}>
          efer
        </Box>
      </Box>
    </>
  )
};

export default Dashboard;
