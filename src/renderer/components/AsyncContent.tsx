import { ReactNode } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FetchStatus } from "@/hooks/useDexieFetch";

type AsyncContentProps = {
  status: FetchStatus;
  error: string;
  children: ReactNode;
};

// Renders the shared loading spinner / error alert for a data fetch and shows
// its children only once loaded. Centralizes the status handling that every
// data-backed screen would otherwise repeat.
function AsyncContent({ status, error, children }: AsyncContentProps) {
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

export default AsyncContent;
