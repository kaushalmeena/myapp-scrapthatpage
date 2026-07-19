import { FileSearchCorner } from "lucide-react";
import { cn } from "@/lib/utils";

// Brand mark: the lucide file-search-corner icon in white on a tile filled
// with the theme's primary color. `bg-primary` auto-adapts to light/dark.
// Kept in sync with src/assets/logo.svg (the source for the app icons/favicon).
export default function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-primary text-white",
        className
      )}
    >
      <FileSearchCorner className="size-[62%]" />
    </div>
  );
}
