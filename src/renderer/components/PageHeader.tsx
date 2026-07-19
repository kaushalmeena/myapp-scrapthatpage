import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export default function PageHeader({
  title,
  subtitle,
  back = false,
  actions
}: {
  title: string;
  // Secondary line under the title (e.g. the script name on the run screen).
  subtitle?: string;
  // Show a back button that returns to the previous screen.
  back?: boolean;
  // Right-aligned header actions (buttons etc.).
  actions?: ReactNode;
}) {
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  return (
    <div className="mb-6 flex items-center gap-2">
      {back && (
        <Button
          variant="ghost"
          size="icon"
          className="-ml-2 shrink-0 text-muted-foreground"
          title="Go back"
          onClick={handleBack}
        >
          <ArrowLeft className="size-5" />
        </Button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-xl font-semibold tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
