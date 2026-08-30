import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useApiConfig } from "../../context/ApiConfigContext.jsx";
import { useNotify } from "../../context/NotifyContext.jsx";
import { DEFAULT_API_BASE_URL } from "../../lib/apiConfig.js";

export default function SettingsDialog({ open, onClose }) {
  const { baseUrl, setBaseUrl } = useApiConfig();
  const { notifySuccess } = useNotify();
  const [value, setValue] = useState(baseUrl);

  useEffect(() => {
    if (open) setValue(baseUrl);
  }, [open, baseUrl]);

  const save = () => {
    setBaseUrl(value || DEFAULT_API_BASE_URL);
    notifySuccess("URL da API atualizada.");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>Configurar API</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Endereco base do back end (FastAPI). Fica salvo neste navegador e tem
            prioridade sobre o valor de build.
          </Typography>
          <TextField
            fullWidth
            autoFocus
            label="URL base"
            value={value}
            placeholder={DEFAULT_API_BASE_URL}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button color="inherit" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={save}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
