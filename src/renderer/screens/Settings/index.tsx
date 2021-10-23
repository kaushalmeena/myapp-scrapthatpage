import {
  ListItemText,
  Box,
  Typography,
  ListItemIcon,
  List,
  Icon,
  ListItem,
  FormControl,
  Select,
  MenuItem
} from "@mui/material";
import React, { useContext } from "react";
import { SETTINGS_KEYS } from "../../constants/settings";
import { ThemeOptions } from "../../constants/themes";
import { SettingsContext } from "../../context/Settings";

const Settings = (): JSX.Element => {
  const { settings, setSettings } = useContext(SettingsContext);

  const updateSettings = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

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
                  updateSettings(SETTINGS_KEYS.Theme, event.target.value);
                }}
              >
                {ThemeOptions.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
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
