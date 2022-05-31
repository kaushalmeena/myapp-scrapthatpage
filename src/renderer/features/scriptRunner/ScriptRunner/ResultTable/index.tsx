/* eslint-disable react/no-array-index-key */
import {
  Icon,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from "@mui/material";
import React from "react";
import { TableData } from "../../types";
import { downloadAsCSV } from "../../utils";

type ResultTableProps = {
  data: TableData;
};

function ResultTable({ data }: ResultTableProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDownloadClick = () => {
    downloadAsCSV(data);
  };

  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  const paginatedData = data.slice(
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
        backgroundColor: "background.paper"
      }}
    >
      <Stack
        direction="row"
        gap={1}
        paddingTop={1}
        paddingX={1}
        justifyContent="flex-end"
      >
        <IconButton onClick={handleDownloadClick}>
          <Icon>file_download</Icon>
        </IconButton>
      </Stack>
      <Table size="small">
        <TableHead>
          <TableRow>
            {headers.map((key) => (
              <TableCell key={`table-head-${key}`}>{key}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row, rowIndex) => (
            <TableRow key={`table-row-${rowIndex}`}>
              {headers.map((key) => (
                <TableCell key={`table-cell-${rowIndex}-${key}`}>
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
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}

export default ResultTable;
