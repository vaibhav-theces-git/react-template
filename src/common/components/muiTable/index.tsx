import {
  Table,
  TableBody,
  TableBodyProps,
  TableCell,
  TableCellProps,
  TableContainer,
  TableContainerProps,
  TableProps,
  TableRow,
  TableRowProps,
} from "@mui/material";

export const MuiTable = (props: TableProps) => <Table {...props} />;
export const MuiTableBody = (props: TableBodyProps) => <TableBody {...props} />;
export const MuiTableCell = (props: TableCellProps) => <TableCell {...props} />;
export const MuiTableContainer = (props: TableContainerProps) => (
  <TableContainer {...props} />
);
export const MuiTableRow = (props: TableRowProps) => <TableRow {...props} />;
