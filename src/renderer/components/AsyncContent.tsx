import { AlertCircle, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type FetchStatus = "loading" | "loaded" | "error";

// Renders the shared loading spinner / error alert for a data fetch and shows
// its children only once loaded. Centralizes the status handling that every
// data-backed screen would otherwise repeat.
export default function AsyncContent({
  status,
  error,
  children
}: {
  status: FetchStatus;
  error?: string;
  children: ReactNode;
}) {
  if (status === "loaded") {
    return <>{children}</>;
  }

  if (status === "error") {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="size-4" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mt-8 flex justify-center">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </div>
  );
}
