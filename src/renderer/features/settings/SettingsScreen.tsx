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
import { type Theme, useSettingsStore } from "./settingsStore";

export default function SettingsScreen() {
  const theme = useSettingsStore((s) => s.theme);
  const showWindow = useSettingsStore((s) => s.showWindow);
  const stepDelayMs = useSettingsStore((s) => s.stepDelayMs);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const setShowWindow = useSettingsStore((s) => s.setShowWindow);
  const setStepDelayMs = useSettingsStore((s) => s.setStepDelayMs);

  const changeTheme = (value: string) => {
    setTheme(value as Theme);
  };

  const changeShowWindow = (value: boolean) => {
    setShowWindow(value);
  };

  const changeStepDelay = (event: ChangeEvent<HTMLInputElement>) => {
    setStepDelayMs(Number(event.target.value) || 0);
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
          <Select value={theme} onValueChange={changeTheme}>
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
          <Switch checked={showWindow} onCheckedChange={changeShowWindow} />
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
            value={stepDelayMs}
            onChange={changeStepDelay}
          />
        </div>
      </Card>
    </>
  );
}
