import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from "@mui/material";
import React, { useState } from "react";
import TableToolbar from "./TableToolbar";

type ResultTableProps = {
  headers: string[];
  rows: Record<string, string>[];
};

function ResultTable({ headers, rows }: ResultTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const pageData = rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <TableContainer
      sx={{
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "action.disabledBackground",
        borderRadius: 1,
        backgroundColor: "background.paper"
      }}
    >
      <TableToolbar headers={headers} rows={rows} />
      <Table size="small">
        <TableHead>
          <TableRow>
            {headers.map((key) => (
              <TableCell key={`table-head-${key}`}>{key}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {pageData.map((row, index) => (
            <TableRow key={`table-row-${index}`}>
              {headers.map((key) => (
                <TableCell key={`table-cell-${index}-${key}`}>
                  {row[key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}

export default ResultTable;
