import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import App from "./App.jsx";
import { theme } from "./theme/theme.js";
import { ApiConfigProvider } from "./context/ApiConfigContext.jsx";
import { NotifyProvider } from "./context/NotifyContext.jsx";

/*
 * Arvore de providers:
 *   ThemeProvider   -> tema Material UI (visual estilo Uber/99)
 *   ApiConfigProvider -> URL base da API + status de saude (online/offline)
 *   NotifyProvider  -> snackbars de sucesso/erro
 *   HashRouter      -> rotas por hash (#/...), funciona em qualquer servidor estatico
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ApiConfigProvider>
        <NotifyProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </NotifyProvider>
      </ApiConfigProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
