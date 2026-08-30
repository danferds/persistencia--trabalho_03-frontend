import { createContext, useCallback, useContext, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const NotifyContext = createContext(null);

const AUTO_HIDE_MS = 4200;

export function NotifyProvider({ children }) {
  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });

  const notify = useCallback((message, severity = "info") => {
    setSnack({ open: true, message, severity });
  }, []);

  const handleClose = useCallback((_event, reason) => {
    if (reason === "clickaway") return;
    setSnack((s) => ({ ...s, open: false }));
  }, []);

  const value = useMemo(
    () => ({
      notify,
      notifySuccess: (m) => notify(m, "success"),
      notifyError: (m) => notify(m, "error"),
      notifyInfo: (m) => notify(m, "info"),
    }),
    [notify],
  );

  return (
    <NotifyContext.Provider value={value}>
      {children}
      <Snackbar
        open={snack.open}
        autoHideDuration={AUTO_HIDE_MS}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={snack.severity}
          variant="filled"
          sx={{ borderRadius: 2.5, fontWeight: 600, alignItems: "center" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </NotifyContext.Provider>
  );
}

export function useNotify() {
  const ctx = useContext(NotifyContext);
  if (!ctx) throw new Error("useNotify precisa estar dentro de <NotifyProvider>");
  return ctx;
}
