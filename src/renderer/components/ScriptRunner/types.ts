import { SvgIconComponent } from "@mui/icons-material";
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

export type ActionButtonColor =
  "primary" | "secondary" | "success" | "error" | "info" | "warning";

export type RunnerCardInfo = {
  title: string;
  color: ActionButtonColor;
  // Palette key used to tint the card background for terminal states; the
  // component resolves it to a theme color so it adapts to light/dark mode.
  tone?: "success" | "error";
  Icon: SvgIconComponent;
};

export type TableData = {
  cols: string[];
  rows: string[][];
};
