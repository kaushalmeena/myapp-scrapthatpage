import {
  Box,
  FormControl,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Typography
} from "@mui/material";
import React from "react";
import { SETTINGS_KEYS } from "../../constants/settings";
import { THEMES } from "../../constants/themes";
import { useSettings } from "../../hooks/useSettings";

const Settings = (): JSX.Element => {
  const { settings, setSettings } = useSettings();

  return (
    <>
      <Typography fontSize={28} fontWeight="400">
        Settings
      </Typography>
      <Box maxWidth={500}>
        <List>
          <ListItem>
            <ListItemIcon>
              <Icon>color_lens</Icon>
            </ListItemIcon>
            <ListItemText
              primary="Theme"
              primaryTypographyProps={{ fontSize: 18 }}
            />
            <FormControl size="small">
              <Select
                value={settings.theme}
                onChange={(event) => {
                  setSettings(SETTINGS_KEYS.Theme, Number(event.target.value));
                }}
              >
                {THEMES.map((item) => (
                  <MenuItem key={item.type} value={item.type}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ListItem>
        </List>
      </Box>
    </>
  );
};

export default Settings;
