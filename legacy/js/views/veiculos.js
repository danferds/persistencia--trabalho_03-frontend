import { api } from "../api.js";
import { idCell } from "../ui.js";
import { createCrudView } from "./crudView.js";

async function motoristaOptions() {
  const res = await api.motoristas.filter({ pageSize: 100, sortBy: ["nome", "asc"] });
  return (res?.data ?? []).map((m) => ({
    value: m._id ?? m.id,
    label: `${m.nome} — ${m.cpf}`,
  }));
}

function motoristaNome(row) {
  const m = row.motorista;
  if (!m) return "—";
  if (typeof m === "string") return m;
  return m.nome || m._id || m.id || "—";
}

export const veiculosView = createCrudView({
  resource: api.veiculos,
  title: "Veículos",
  subtitle: "Frota vinculada aos motoristas.",
  searchFields: [
    { value: "placa", label: "Placa" },
    { value: "modelo", label: "Modelo" },
    { value: "cor", label: "Cor" },
    { value: "ano", label: "Ano", op: "$eq" },
  ],
  columns: [
    { key: "_id", label: "ID", render: (r) => idCell(r._id ?? r.id) },
    { key: "placa", label: "Placa" },
    { key: "modelo", label: "Modelo" },
    { key: "ano", label: "Ano" },
    { key: "cor", label: "Cor" },
    { key: "motorista", label: "Motorista", render: motoristaNome },
  ],
  createFields: [
    { key: "motorista_id", label: "Motorista", type: "select", required: true, placeholder: "selecione…", options: motoristaOptions },
    { key: "placa", label: "Placa", required: true },
    { key: "modelo", label: "Modelo", required: true },
    { key: "ano", label: "Ano", type: "number", required: true, step: "1" },
    { key: "cor", label: "Cor", required: true },
  ],
  editFields: [
    { key: "modelo", label: "Modelo" },
    { key: "ano", label: "Ano", type: "number", step: "1" },
    { key: "cor", label: "Cor" },
  ],
  toCreateParams: (f) => ({
    motorista_id: f.motorista_id,
    placa: f.placa,
    modelo: f.modelo,
    ano: Number(f.ano),
    cor: f.cor,
  }),
  toEditParams: (f) => {
    const p = {};
    if (f.modelo) p.modelo = f.modelo;
    if (f.ano) p.ano = Number(f.ano);
    if (f.cor) p.cor = f.cor;
    return p;
  },
});
