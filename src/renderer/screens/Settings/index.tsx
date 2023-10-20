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
import PageName from "../../components/PageName";
import { THEMES } from "../../constants/themes";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectSettings, updateTheme } from "../../redux/slices/settingsSlice";
import { ThemeType } from "../../types/theme";

function Settings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);

  const handleThemeChange = (event: SelectChangeEvent) => {
    const theme = event.target.value as ThemeType;
    dispatch(updateTheme(theme));
  };

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
      </Box>
    </>
  );
}

export default Settings;
