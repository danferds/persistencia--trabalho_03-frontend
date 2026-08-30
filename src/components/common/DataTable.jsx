import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

/**
 * Tabela generica dirigida por config.
 *
 * @param {Array<{key,label,align?,render?}>} columns
 * @param {Array<object>} rows
 * @param {(row)=>string} [getRowKey]
 * @param {(row)=>React.ReactNode} [rowActions]  celula extra alinhada a direita
 */
export default function DataTable({ columns, rows, getRowKey, rowActions }) {
  return (
    <TableContainer sx={{ overflowX: "auto" }}>
      <Table size="small" sx={{ minWidth: 640 }}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key} align={col.align}>
                {col.label}
              </TableCell>
            ))}
            {rowActions && <TableCell align="right">Acoes</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={getRowKey ? getRowKey(row) : index} hover>
              {columns.map((col) => (
                <TableCell key={col.key} align={col.align}>
                  {col.render ? col.render(row) : row[col.key] ?? "—"}
                </TableCell>
              ))}
              {rowActions && (
                <TableCell align="right">
                  <Box sx={{ whiteSpace: "nowrap" }}>{rowActions(row)}</Box>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
