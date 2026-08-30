import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import CrudForm, { buildInitialValues } from "./CrudForm.jsx";
import { useNotify } from "../../context/NotifyContext.jsx";
import { errorMessage } from "../../lib/apiClient.js";

/** Modal de edicao. `onSubmit(values)` deve lancar em caso de erro. */
export default function CrudEditDialog({ open, singular, fields, row, onClose, onSubmit }) {
  const [values, setValues] = useState({});
  const [busy, setBusy] = useState(false);
  const { notifyError } = useNotify();
  const formId = `edit-${singular}`;

  useEffect(() => {
    if (open) setValues(buildInitialValues(fields, row));
  }, [open, fields, row]);

  const submit = async () => {
    setBusy(true);
    try {
      await onSubmit(values);
    } catch (err) {
      notifyError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Editar {singular.toLowerCase()}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <CrudForm id={formId} fields={fields} values={values} onChange={setValues} onSubmit={submit} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button color="inherit" onClick={onClose} disabled={busy}>
          Cancelar
        </Button>
        <Button type="submit" form={formId} variant="contained" disabled={busy}>
          Salvar alteracoes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
