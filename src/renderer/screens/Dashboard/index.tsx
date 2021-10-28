import {
  Box,
  Card,
  CardActionArea,
  CardHeader,
  Icon,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  Typography
} from "@mui/material";
import React from "react";
import { useHistory } from "react-router";
import { PAGE_LINKS } from "../../constants/layout";

const Dashboard = (): JSX.Element => {
  const history = useHistory();
  return (
    <>
      <Typography fontSize={28} fontWeight="400">
        Dashboard
      </Typography>
      <Stack marginTop={2} direction="row">
        <Box flex={1}>
          <Stack gap={1}>
            {PAGE_LINKS.map((link) => (
              <Card key={`link-${link.title}`} variant="outlined">
                <CardActionArea onClick={() => history.push(link.route)}>
                  <CardHeader
                    avatar={<Icon fontSize="large">{link.icon}</Icon>}
                    title={link.title}
                    titleTypographyProps={{ fontSize: 18, fontWeight: "400" }}
                    subheader={link.subtitle}
                  />
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        </Box>
        <Box marginX={2} display="flex" flexDirection="row" flex={1}>
          <Icon sx={{ color: "primary.main", fontSize: 84 }}>find_in_page</Icon>
          <Box>
            <Typography variant="h5">ScrapThatPage!</Typography>
            <Typography variant="subtitle1">
              v{process.env.npm_package_version}
            </Typography>
          </Box>
        </Box>
      </Stack>
      <Box marginTop={2} display="flex" flexDirection="row">
        <Box flex={1}>
          <List
            dense
            subheader={<ListSubheader>Unsaved Scripts</ListSubheader>}
          >
            <ListItemButton>
              <ListItemText primary="My script 1" />
            </ListItemButton>
          </List>
        </Box>
        <Box flex={1}>
          <List dense subheader={<ListSubheader>Recent Scripts</ListSubheader>}>
            <ListItemButton>
              <ListItemText primary="My script 1" />
            </ListItemButton>
          </List>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
