import { api } from "../api.js";
import { VIAGEM_STATUS } from "../config.js";
import { idCell, badge, fmtDate } from "../ui.js";
import { createCrudView } from "./crudView.js";

const nome = (v) => (!v ? "—" : typeof v === "string" ? v : v.nome || v._id || v.id || "—");
const cidade = (v) => (!v ? "—" : typeof v === "string" ? v : v.cidade || "—");

function statusCell(row) {
  const info = VIAGEM_STATUS[row.status] || { label: `#${row.status}`, badge: "info" };
  return badge(info.label, info.badge);
}

async function pessoaOptions(resource) {
  const res = await resource.filter({ pageSize: 100, sortBy: ["nome", "asc"] });
  return (res?.data ?? []).map((p) => ({ value: p._id ?? p.id, label: `${p.nome} — ${p.cpf}` }));
}

async function localizacaoOptions() {
  const res = await api.localizacoes.filter({ pageSize: 100, sortBy: ["cidade", "asc"] });
  return (res?.data ?? []).map((l) => ({
    value: l._id ?? l.id,
    label: `${l.cidade} — ${l.rua}, ${l.numero}`,
  }));
}

const statusOptions = Object.entries(VIAGEM_STATUS).map(([value, info]) => ({
  value,
  label: info.label,
}));

export const viagensView = createCrudView({
  resource: api.viagens,
  title: "Viagens",
  subtitle: "Corridas que conectam motorista, passageiro e localizações (consulta com 3+ entidades).",
  searchFields: [
    { value: "status", label: "Status", op: "$eq" },
    { value: "criado_em", label: "Criado em" },
  ],
  columns: [
    { key: "_id", label: "ID", render: (r) => idCell(r._id ?? r.id) },
    { key: "status", label: "Status", render: statusCell },
    { key: "motorista", label: "Motorista", render: (r) => nome(r.motorista) },
    { key: "passageiro", label: "Passageiro", render: (r) => nome(r.passageiro) },
    { key: "localizacao_inicial", label: "Origem", render: (r) => cidade(r.localizacao_inicial) },
    { key: "localizacao_final", label: "Destino", render: (r) => cidade(r.localizacao_final) },
    { key: "criado_em", label: "Criado em", render: (r) => fmtDate(r.criado_em) },
  ],
  createFields: [
    { key: "motorista_id", label: "Motorista", type: "select", required: true, placeholder: "selecione…", options: () => pessoaOptions(api.motoristas) },
    { key: "passageiro_id", label: "Passageiro", type: "select", required: true, placeholder: "selecione…", options: () => pessoaOptions(api.passageiros) },
    { key: "localizacao_inicial_id", label: "Origem", type: "select", required: true, placeholder: "selecione…", options: localizacaoOptions },
    { key: "localizacao_final_id", label: "Destino", type: "select", required: true, placeholder: "selecione…", options: localizacaoOptions },
  ],
  editFields: [
    {
      key: "status",
      label: "Status",
      type: "select",
      staticOptions: statusOptions,
      initial: (row) => String(row.status),
    },
  ],
  toCreateParams: (f) => ({
    motorista_id: f.motorista_id,
    passageiro_id: f.passageiro_id,
    localizacao_inicial_id: f.localizacao_inicial_id,
    localizacao_final_id: f.localizacao_final_id,
  }),
  toEditParams: (f) => ({ status: Number(f.status) }),
});
