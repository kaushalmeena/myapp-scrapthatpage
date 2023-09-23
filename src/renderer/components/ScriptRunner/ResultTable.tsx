import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { TableData } from "./types";
import TableToolbar from "./TableToolbar";

type ResultTableProps = {
  data: TableData;
};

function ResultTable({ data }: ResultTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const pageRows = data.rows.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  return (
    <TableContainer
      sx={{
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "action.disabledBackground",
        borderRadius: 1,
        backgroundColor: "background.paper",
        maxHeight: 440
      }}
    >
      <TableToolbar data={data} />
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {data.cols.map((key) => (
              <TableCell key={`th-${key}`}>{key}</TableCell>
            ))}
          </TableRow>
        </TableHead>
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
      <TablePagination
        component="div"
        count={data.rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}

export default ResultTable;
