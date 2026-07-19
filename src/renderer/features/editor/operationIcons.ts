import {
  GitBranch,
  Globe,
  Hourglass,
  Keyboard,
  type LucideIcon,
  Minus,
  MousePointerClick,
  MoveVertical,
  Plus,
  Repeat2,
  ScanText,
  Timer,
  Variable
} from "lucide-react";
import type { SmallOperation } from "../../../common/types/smallOperation";

// One icon per step type, shared by the step cards and the step picker so
// each operation stays visually recognizable across the editor.
export const OPERATION_ICONS: Record<SmallOperation["type"], LucideIcon> = {
  open: Globe,
  extract: ScanText,
  click: MousePointerClick,
  type: Keyboard,
  set: Variable,
  increase: Plus,
  decrease: Minus,
  if: GitBranch,
  while: Repeat2,
  wait: Hourglass,
  delay: Timer,
  scroll: MoveVertical
};
