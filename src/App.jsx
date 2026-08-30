import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout.jsx";
import { useApiConfig } from "./context/ApiConfigContext.jsx";

import DashboardPage from "./features/dashboard/DashboardPage.jsx";
import ConsultasPage from "./features/consultas/ConsultasPage.jsx";
import CrudPage from "./components/crud/CrudPage.jsx";

import { motoristasConfig } from "./features/motoristas/config.jsx";
import { passageirosConfig } from "./features/passageiros/config.jsx";
import { veiculosConfig } from "./features/veiculos/config.jsx";
import { localizacoesConfig } from "./features/localizacoes/config.jsx";
import { viagensConfig } from "./features/viagens/config.jsx";

// Recursos "planos": todos usam a mesma tela generica <CrudPage>.
const CRUD_ROUTES = [
  { path: "/motoristas", config: motoristasConfig },
  { path: "/passageiros", config: passageirosConfig },
  { path: "/veiculos", config: veiculosConfig },
  { path: "/localizacoes", config: localizacoesConfig },
  { path: "/viagens", config: viagensConfig },
];

export default function App() {
  const { baseUrl } = useApiConfig();

  return (
    <AppLayout>
      {/* key={baseUrl}: trocar a URL da API remonta as telas e refaz as buscas. */}
      <Routes key={baseUrl}>
        <Route path="/" element={<DashboardPage />} />
        {CRUD_ROUTES.map(({ path, config }) => (
          <Route key={path} path={path} element={<CrudPage key={config.key} config={config} />} />
        ))}
        <Route path="/consultas" element={<ConsultasPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}
