import {
  FormControl,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent
} from "@mui/material";
import React from "react";
import { THEMES } from "../../../constants/themes";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { selectSettings, updateTheme } from "../settingsSlice";

function AppSettings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);

  const handleThemeChange = (event: SelectChangeEvent) =>
    dispatch(updateTheme(event.target.value));

  return (
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
          <Select value={settings.theme} onChange={handleThemeChange}>
            {Object.entries(THEMES).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </ListItem>
    </List>
  );
}

export default AppSettings;
