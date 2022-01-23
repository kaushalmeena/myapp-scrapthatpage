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
import PageName from "../../components/PageName";
import { useDispatch, useSelector } from "react-redux";
import { setSettings } from "../../actions/settings";
import { RootState } from "../../types/store";

const Settings = (): JSX.Element => {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);

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
                  dispatch(
                    setSettings(SETTINGS_KEYS.THEME, Number(event.target.value))
                  );
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
