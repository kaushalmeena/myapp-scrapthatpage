import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { downloadAsCSV, downloadAsJSON } from "./runnerUtils";
import { TableData } from "./types";

type TableToolbarProps = {
  data: TableData;
};

function TableToolbar({ data }: TableToolbarProps) {
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default TableToolbar;
