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
  SelectChangeEvent
} from "@mui/material";
import React from "react";
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux";
import { setSettings } from "../../actions/settings";
import PageName from "../../components/PageName";
import { SETTINGS_KEYS } from "../../constants/settings";
import { THEMES, THEME_TYPES } from "../../constants/themes";
import { SettingsState } from "../../types/settings";
import { StoreRootState } from "../../types/store";

type SettingsStateProps = {
  settings: SettingsState;
};

type SettingsDispatchProps = {
  handleThemeChange: (event: SelectChangeEvent<THEME_TYPES>) => void;
};

type SettingsOwnProps = Record<string, never>;

type SettingsProps = SettingsStateProps &
  SettingsDispatchProps &
  SettingsOwnProps;

const Settings = (props: SettingsProps): JSX.Element => {
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
                value={props.settings.theme}
                onChange={props.handleThemeChange}
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

const mapStateToProps: MapStateToProps<
  SettingsStateProps,
  SettingsOwnProps,
  StoreRootState
> = (state) => ({
  settings: state.settings
});

const mapDispatchToProps: MapDispatchToProps<
  SettingsDispatchProps,
  SettingsOwnProps
> = (dispatch) => ({
  handleThemeChange: (event) =>
    dispatch(setSettings(SETTINGS_KEYS.THEME, Number(event.target.value)))
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
