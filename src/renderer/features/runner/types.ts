import { LucideIcon } from "lucide-react";
import { ScraperOperation } from "../../../common/types/scraper";

export type RunnerGenerator = Generator<
  ScraperOperation,
  void,
  ScraperOperation
>;

export type RunnerStatus =
  "ready" | "started" | "stopped" | "finished" | "error";

export type RunnerHeaderInfo = {
  heading: string;
  message: string;
};

export type ActionButtonColor = "default" | "success" | "destructive";

export type RunnerCardInfo = {
  title: string;
  color: ActionButtonColor;
  // Palette key used to tint the card background for terminal states; the
  // component resolves it to a theme color so it adapts to light/dark mode.
  tone?: "success" | "error";
  Icon: LucideIcon;
};

export type TableData = {
  cols: string[];
  rows: string[][];
};
