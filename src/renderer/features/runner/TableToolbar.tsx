import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  copyTableToClipboard,
  downloadAsCSV,
  downloadAsJSON,
  downloadAsXLSX
} from "./runnerUtils";
import type { TableData } from "./types";

export default function TableToolbar({ data }: { data: TableData }) {
  const handleCSVDownload = () => downloadAsCSV(data);

  const handleJSONDownload = () => downloadAsJSON(data);

  const handleXLSXDownload = () =>
    downloadAsXLSX(data).catch(() => toast.error("Export failed"));

  const handleCopyToClipboard = () =>
    copyTableToClipboard(data)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Export failed"));

  return (
    <div className="flex flex-row items-center justify-between border-b px-4 py-2.5">
      <h3 className="text-sm font-semibold">
        Results
        <span className="ml-2 font-normal text-muted-foreground">
          {data.rows.length} {data.rows.length === 1 ? "row" : "rows"} ·{" "}
          {data.cols.length} {data.cols.length === 1 ? "column" : "columns"}
        </span>
      </h3>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="size-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCSVDownload}>
            Download as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleJSONDownload}>
            Download as JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleXLSXDownload}>
            Download as XLSX
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopyToClipboard}>
            Copy to clipboard
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
