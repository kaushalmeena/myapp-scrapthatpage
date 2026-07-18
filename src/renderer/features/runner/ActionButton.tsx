import { Loader2, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActionButtonColor } from "./types";

type ActionButtonProps = {
  spinning: boolean;
  title: string;
  color: ActionButtonColor;
  Icon: LucideIcon;
  onClick: () => void;
};

function ActionButton({
  spinning,
  title,
  color,
  Icon,
  onClick
}: ActionButtonProps) {
  return (
    <div className="relative">
      <Button
        title={title}
        variant={color === "destructive" ? "destructive" : "default"}
        className={cn(
          "size-10 rounded-full p-0",
          color === "success" &&
            "bg-success text-success-foreground hover:bg-success/90"
        )}
        onClick={onClick}
      >
        <Icon className="size-5" />
      </Button>
      {spinning && (
        <Loader2 className="pointer-events-none absolute -inset-1 size-12 animate-spin text-primary" />
      )}
    </div>
  );
}

export default ActionButton;
