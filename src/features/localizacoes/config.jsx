import { api } from "../../api/index.js";
import IdChip from "../../components/common/IdChip.jsx";

export const localizacoesConfig = {
  key: "localizacoes",
  resource: api.localizacoes,
  title: "Localizacoes",
  subtitle: "Pontos de origem e destino usados nas viagens.",

  searchFields: [
    { value: "cidade", label: "Cidade" },
    { value: "rua", label: "Rua" },
    { value: "numero", label: "Numero", op: "$eq" },
  ],

  columns: [
    { key: "_id", label: "ID", render: (r) => <IdChip id={r._id ?? r.id} /> },
    { key: "cidade", label: "Cidade" },
    { key: "rua", label: "Rua" },
    { key: "numero", label: "Numero" },
    { key: "latitude", label: "Latitude" },
    { key: "longitude", label: "Longitude" },
  ],

  createFields: [
    { key: "cidade", label: "Cidade", required: true },
    { key: "rua", label: "Rua", required: true },
    { key: "numero", label: "Numero", type: "number", required: true, step: "1" },
    { key: "latitude", label: "Latitude", type: "number", required: true, step: "any" },
    { key: "longitude", label: "Longitude", type: "number", required: true, step: "any" },
  ],

  editFields: [
    { key: "cidade", label: "Cidade" },
    { key: "rua", label: "Rua" },
    { key: "numero", label: "Numero", type: "number", step: "1" },
    { key: "latitude", label: "Latitude", type: "number", step: "any" },
    { key: "longitude", label: "Longitude", type: "number", step: "any" },
  ],

  toCreateParams: (f) => ({
    cidade: f.cidade,
    rua: f.rua,
    numero: Number(f.numero),
    latitude: Number(f.latitude),
    longitude: Number(f.longitude),
  }),
  toEditParams: (f) => {
    const p = {};
    if (f.cidade) p.cidade = f.cidade;
    if (f.rua) p.rua = f.rua;
    if (f.numero !== "") p.numero = Number(f.numero);
    if (f.latitude !== "") p.latitude = Number(f.latitude);
    if (f.longitude !== "") p.longitude = Number(f.longitude);
    return p;
  },
};
