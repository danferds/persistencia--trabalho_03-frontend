import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import BadgeRounded from "@mui/icons-material/BadgeRounded";
import DirectionsCarFilledRounded from "@mui/icons-material/DirectionsCarFilledRounded";
import GroupsRounded from "@mui/icons-material/GroupsRounded";
import PlaceRounded from "@mui/icons-material/PlaceRounded";
import RouteRounded from "@mui/icons-material/RouteRounded";

import PageHeader from "../../components/common/PageHeader.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import LoadingState from "../../components/common/LoadingState.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { api } from "../../api/index.js";
import { errorMessage } from "../../lib/apiClient.js";

const METRICS = [
  { key: "motoristas", label: "Motoristas", Icon: BadgeRounded },
  { key: "passageiros", label: "Passageiros", Icon: GroupsRounded },
  { key: "veiculos", label: "Veiculos", Icon: DirectionsCarFilledRounded },
  { key: "localizacoes", label: "Localizacoes", Icon: PlaceRounded },
  { key: "viagens", label: "Viagens", Icon: RouteRounded },
];

const PARTIDA_COLUMNS = [
  { key: "ponto_partida", label: "Cidade de partida", render: (r) => r.ponto_partida ?? "—" },
  {
    key: "total",
    label: "Total de viagens",
    align: "right",
    render: (r) => <strong>{r.total ?? 0}</strong>,
  },
];

export default function DashboardPage() {
  const [counts, setCounts] = useState({}); // { [key]: number | "—" }
  const [partida, setPartida] = useState({ loading: true, rows: [], error: null });

  useEffect(() => {
    let alive = true;

    METRICS.forEach(({ key }) => {
      api[key]
        .count()
        .then((n) => alive && setCounts((c) => ({ ...c, [key]: n })))
        .catch(() => alive && setCounts((c) => ({ ...c, [key]: "—" })));
    });

    api.viagens
      .contagemPorPontoPartida()
      .then((rows) => alive && setPartida({ loading: false, rows, error: null }))
      .catch((err) => alive && setPartida({ loading: false, rows: [], error: errorMessage(err) }));

    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <PageHeader
        title="Painel"
        subtitle="Visao geral dos dados da plataforma de mobilidade urbana."
      />

      <Box
        sx={{
          display: "grid",
          gap: 2,
          mb: 3,
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            lg: "repeat(5, 1fr)",
          },
        }}
      >
        {METRICS.map(({ key, label, Icon }) => (
          <StatCard
            key={key}
            label={label}
            Icon={Icon}
            loading={counts[key] === undefined}
            value={counts[key]}
          />
        ))}
      </Box>

      <Card>
        <CardContent>
          <Typography variant="overline" color="text.secondary">
            Viagens por ponto de partida
          </Typography>
          <Box sx={{ mt: 2 }}>
            {partida.loading ? (
              <LoadingState />
            ) : partida.error ? (
              <EmptyState message={partida.error} />
            ) : partida.rows.length === 0 ? (
              <EmptyState message="Sem viagens registradas." />
            ) : (
              <DataTable columns={PARTIDA_COLUMNS} rows={partida.rows} />
            )}
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
