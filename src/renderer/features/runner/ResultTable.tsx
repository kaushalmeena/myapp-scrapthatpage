import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import TableToolbar from "./TableToolbar";
import { TableData } from "./types";

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

type ResultTableProps = {
  data: TableData;
};

function ResultTable({ data }: ResultTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const pageCount = Math.max(1, Math.ceil(data.rows.length / rowsPerPage));

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(+value);
    setPage(0);
  };

  const pageRows = data.rows.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  return (
    <div className="rounded-lg border bg-card">
      <TableToolbar data={data} />
      <Table>
        <TableHeader>
          <TableRow>
            {data.cols.map((key) => (
              <TableHead key={`th-${key}`}>{key}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageRows.map((row, rowIdx) => (
            <TableRow key={`tr-${rowIdx}`}>
              {row.map((item, colIdx) => (
                <TableCell key={`td-${rowIdx}-${colIdx}`}>
                  {item || ""}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end gap-4 p-2 text-sm">
        <span className="text-muted-foreground">Rows per page</span>
        <Select
          value={String(rowsPerPage)}
          onValueChange={handleRowsPerPageChange}
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROWS_PER_PAGE_OPTIONS.map((option) => (
              <SelectItem key={`option-${option}`} value={String(option)}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>
          page {page + 1} of {pageCount}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            title="Previous page"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Next page"
            disabled={page >= pageCount - 1}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ResultTable;
