import { FileSearchCorner } from "lucide-react";
import { cn } from "@/lib/utils";

// Brand mark: the lucide file-search-corner icon on a tile filled with the
// theme's primary color. Uses the primary bg + foreground pair (same as the
// primary button), so it auto-adapts to light/dark.
// Kept in sync with src/assets/logo.svg (the source for the app icons/favicon).
export default function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-primary text-primary-foreground",
        className
      )}
    >
      <FileSearchCorner className="size-[62%]" />
    </div>
  );
}
