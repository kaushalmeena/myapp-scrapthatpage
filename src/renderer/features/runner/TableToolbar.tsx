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
import { TableData } from "./types";

type TableToolbarProps = {
  data: TableData;
};

function TableToolbar({ data }: TableToolbarProps) {
  const handleXLSXDownload = () =>
    downloadAsXLSX(data).catch(() => toast.error("Export failed"));

  const handleCopyToClipboard = () =>
    copyTableToClipboard(data)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Export failed"));

  return (
    <div className="flex flex-row items-center justify-between border-b p-3">
      <h3 className="font-semibold">Results</h3>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="size-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => downloadAsCSV(data)}>
            Download as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => downloadAsJSON(data)}>
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

export default TableToolbar;
