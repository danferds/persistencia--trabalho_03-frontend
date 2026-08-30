import { useCallback, useMemo, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";

import PageHeader from "../common/PageHeader.jsx";
import LoadingState from "../common/LoadingState.jsx";
import EmptyState from "../common/EmptyState.jsx";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import CrudCreateCard from "./CrudCreateCard.jsx";
import CrudToolbar from "./CrudToolbar.jsx";
import CrudTable from "./CrudTable.jsx";
import CrudEditDialog from "./CrudEditDialog.jsx";

import { useCrudResource } from "../../hooks/useCrudResource.js";
import { useNotify } from "../../context/NotifyContext.jsx";
import { errorMessage } from "../../lib/apiClient.js";

/**
 * Tela de CRUD completa (criar / listar / filtrar / ordenar / paginar /
 * editar / excluir) dirigida por um objeto de configuracao.
 *
 * @param {object} config  ver features/<recurso>/config.jsx
 */
export default function CrudPage({ config }) {
  const idKey = config.idKey || "_id";
  const rowId = useCallback((row) => row?.[idKey] ?? row?.id, [idKey]);
  const singular = useMemo(() => config.title.replace(/s$/, ""), [config.title]);
  const canEdit = Array.isArray(config.editFields) && config.editFields.length > 0;

  const crud = useCrudResource(config);
  const { notifySuccess, notifyError } = useNotify();

  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  /* ---------- acoes ---------- */
  const handleCreate = async (form) => {
    await config.resource.create(config.toCreateParams(form));
    notifySuccess(`${singular} criado com sucesso.`);
    crud.refresh();
  };

  const handleUpdate = async (form) => {
    const params = config.toEditParams ? config.toEditParams(form, editingRow) : form;
    await config.resource.update(rowId(editingRow), params);
    notifySuccess("Registro atualizado.");
    setEditingRow(null);
    crud.reload();
  };

  const handleDelete = async () => {
    setDeleteBusy(true);
    try {
      await config.resource.remove(rowId(deletingRow));
      notifySuccess("Registro excluido.");
      setDeletingRow(null);
      crud.reload();
    } catch (err) {
      notifyError(errorMessage(err));
    } finally {
      setDeleteBusy(false);
    }
  };

  /* ---------- render ---------- */
  return (
    <>
      <PageHeader title={config.title} subtitle={config.subtitle} />

      <Stack spacing={3}>
        <CrudCreateCard singular={singular} fields={config.createFields} onCreate={handleCreate} />

        <Card>
          <CardContent>
            <CrudToolbar config={config} crud={crud} />

            {crud.loading ? (
              <LoadingState />
            ) : crud.error ? (
              <EmptyState message={crud.error} />
            ) : crud.rows.length === 0 ? (
              <EmptyState />
            ) : (
              <CrudTable
                config={config}
                rows={crud.rows}
                rowId={rowId}
                canEdit={canEdit}
                onEdit={setEditingRow}
                onDelete={setDeletingRow}
                page={crud.page}
                hasNextPage={crud.hasNextPage}
                onPageChange={crud.setPage}
              />
            )}
          </CardContent>
        </Card>
      </Stack>

      <CrudEditDialog
        open={Boolean(editingRow)}
        singular={singular}
        fields={config.editFields || []}
        row={editingRow}
        onClose={() => setEditingRow(null)}
        onSubmit={handleUpdate}
      />

      <ConfirmDialog
        open={Boolean(deletingRow)}
        title="Excluir registro"
        message={
          deletingRow
            ? `Tem certeza que deseja excluir este registro (${rowId(deletingRow)})? Essa acao nao pode ser desfeita.`
            : ""
        }
        loading={deleteBusy}
        onConfirm={handleDelete}
        onClose={() => setDeletingRow(null)}
      />
    </>
  );
}
