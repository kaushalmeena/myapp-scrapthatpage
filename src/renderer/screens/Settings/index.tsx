import {
  Box,
  FormControl,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select
} from "@mui/material";
import React from "react";
import { SETTINGS_KEYS } from "../../constants/settings";
import { THEMES } from "../../constants/themes";
import { useSettings } from "../../hooks/useSettings";
import PageName from "../../components/PageName";

const Settings = (): JSX.Element => {
  const { settings, setSettings } = useSettings();

  return (
    <>
      <PageName name="Settings" />
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
                  setSettings(SETTINGS_KEYS.THEME, Number(event.target.value));
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
