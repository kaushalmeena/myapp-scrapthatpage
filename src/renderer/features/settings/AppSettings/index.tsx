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
import { THEMES, THEME_TYPES } from "../../../constants/themes";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { updateTheme } from "../settingsSlice";

const AppSettings = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);

  const handleThemeChange = (event: SelectChangeEvent<THEME_TYPES>) =>
    dispatch(updateTheme({ theme: event.target.value as THEME_TYPES }));

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
};

export default AppSettings;
