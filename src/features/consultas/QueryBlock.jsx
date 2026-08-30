import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SearchRounded from "@mui/icons-material/SearchRounded";

import DataTable from "../../components/common/DataTable.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import LoadingState from "../../components/common/LoadingState.jsx";
import { useNotify } from "../../context/NotifyContext.jsx";
import { errorMessage } from "../../lib/apiClient.js";
import { formatCell } from "../../utils/format.js";

/** Bloco de uma consulta: form de parametros + tabela de resultado. */
export default function QueryBlock({ consulta }) {
  const [args, setArgs] = useState(() =>
    Object.fromEntries(consulta.inputs.map((i) => [i.key, ""])),
  );
  const [state, setState] = useState({ status: "idle", rows: [], message: "" });
  const { notifyError } = useNotify();

  const submit = async (event) => {
    event.preventDefault();
    setState({ status: "loading", rows: [], message: "" });
    try {
      const trimmed = Object.fromEntries(
        Object.entries(args).map(([k, v]) => [k, v.trim()]),
      );
      const rows = await consulta.run(trimmed);
      setState({ status: "done", rows: Array.isArray(rows) ? rows : [], message: "" });
    } catch (err) {
      setState({ status: "error", rows: [], message: errorMessage(err) });
      notifyError(errorMessage(err));
    }
  };

  const columns =
    state.rows.length > 0
      ? Object.keys(state.rows[0]).map((key) => ({
          key,
          label: consulta.labels?.[key] || key,
          render: (row) => formatCell(row[key]),
        }))
      : [];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{consulta.title}</Typography>
        {consulta.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
            {consulta.description}
          </Typography>
        )}

        <Box
          component="form"
          onSubmit={submit}
          sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center", mb: 2 }}
        >
          {consulta.inputs.map((input) => (
            <TextField
              key={input.key}
              label={input.label}
              type={input.type || "text"}
              placeholder={input.placeholder}
              value={args[input.key]}
              onChange={(e) => setArgs((a) => ({ ...a, [input.key]: e.target.value }))}
              sx={{ flex: "1 1 240px" }}
            />
          ))}
          <Button
            type="submit"
            variant="contained"
            startIcon={<SearchRounded />}
            disabled={state.status === "loading"}
          >
            Consultar
          </Button>
        </Box>

        {state.status === "idle" && (
          <EmptyState message="Informe os parametros e clique em Consultar." />
        )}
        {state.status === "loading" && <LoadingState label="consultando" />}
        {state.status === "error" && <EmptyState message={state.message} />}
        {state.status === "done" &&
          (state.rows.length === 0 ? (
            <EmptyState message="Nenhum resultado." />
          ) : (
            <DataTable columns={columns} rows={state.rows} />
          ))}
      </CardContent>
    </Card>
  );
}
