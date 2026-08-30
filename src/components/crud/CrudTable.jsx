import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import EditRounded from "@mui/icons-material/EditRounded";

import DataTable from "../common/DataTable.jsx";

/** Tabela de registros + acoes por linha + paginacao. */
export default function CrudTable({
  config,
  rows,
  rowId,
  canEdit,
  onEdit,
  onDelete,
  page,
  hasNextPage,
  onPageChange,
}) {
  return (
    <>
      <DataTable
        columns={config.columns}
        rows={rows}
        getRowKey={rowId}
        rowActions={(row) => (
          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
            {canEdit && (
              <Tooltip title="Editar">
                <IconButton size="small" onClick={() => onEdit(row)}>
                  <EditRounded fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Excluir">
              <IconButton size="small" color="error" onClick={() => onDelete(row)}>
                <DeleteOutlineRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={1}
        sx={{ mt: 2 }}
      >
        <Typography variant="body2" color="text.secondary">
          Pagina {page} · {rows.length} registro(s) exibido(s)
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            startIcon={<ChevronLeftRounded />}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Anterior
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            endIcon={<ChevronRightRounded />}
            disabled={!hasNextPage}
            onClick={() => onPageChange(page + 1)}
          >
            Proxima
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
