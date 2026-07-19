import { Eye, Palette, Timer } from "lucide-react";
import type { ChangeEvent } from "react";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  selectOperationDelayMs,
  selectShowScraperWindow,
  selectTheme,
  type Theme,
  updateOperationDelayMs,
  updateShowScraperWindow,
  updateTheme
} from "./settingsSlice";

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const showScraperWindow = useAppSelector(selectShowScraperWindow);
  const operationDelayMs = useAppSelector(selectOperationDelayMs);

  const handleThemeChange = (value: string) => {
    dispatch(updateTheme(value as Theme));
  };

  const handleShowScraperWindowChange = (value: boolean) => {
    dispatch(updateShowScraperWindow(value));
  };

  const handleOperationDelayChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(updateOperationDelayMs(Number(event.target.value) || 0));
  };

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Appearance and scraping preferences"
      />
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
        <Separator />
        <div className="flex items-center gap-4">
          <Eye className="size-5 text-muted-foreground" />
          <div className="flex-1">
            <Label>Show scraper window</Label>
            <p className="text-xs text-muted-foreground">
              Turn off to run scripts in the background without opening a
              browser window
            </p>
          </div>
          <Switch
            checked={showScraperWindow}
            onCheckedChange={handleShowScraperWindowChange}
          />
        </div>
        <Separator />
        <div className="flex items-center gap-4">
          <Timer className="size-5 text-muted-foreground" />
          <div className="flex-1">
            <Label>Delay between steps</Label>
            <p className="text-xs text-muted-foreground">
              Pause (in ms) between steps so sites aren&apos;t hammered with
              rapid-fire actions
            </p>
          </div>
          <Input
            type="number"
            className="h-8 w-24"
            min={0}
            value={operationDelayMs}
            onChange={handleOperationDelayChange}
          />
        </div>
      </Card>
    </>
  );
}
