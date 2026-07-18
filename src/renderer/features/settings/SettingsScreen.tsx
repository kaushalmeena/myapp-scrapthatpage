import { Palette } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectTheme, ThemeType, updateTheme } from "./settingsSlice";

function SettingsScreen() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  const handleThemeChange = (value: string) => {
    dispatch(updateTheme(value as ThemeType));
  };

  return (
    <>
      <PageHeader title="Settings" />
      <Card className="max-w-md p-4">
        <div className="flex items-center gap-4">
          <Palette className="size-5 text-muted-foreground" />
          <Label className="flex-1">Theme</Label>
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>
    </>
  );
}

export default SettingsScreen;
