import { api } from "../api.js";
import { idCell } from "../ui.js";
import { createCrudView } from "./crudView.js";

export const localizacoesView = createCrudView({
  resource: api.localizacoes,
  title: "Localizações",
  subtitle: "Pontos de origem e destino usados nas viagens.",
  searchFields: [
    { value: "cidade", label: "Cidade" },
    { value: "rua", label: "Rua" },
    { value: "numero", label: "Número", op: "$eq" },
  ],
  columns: [
    { key: "_id", label: "ID", render: (r) => idCell(r._id ?? r.id) },
    { key: "cidade", label: "Cidade" },
    { key: "rua", label: "Rua" },
    { key: "numero", label: "Número" },
    { key: "latitude", label: "Latitude" },
    { key: "longitude", label: "Longitude" },
  ],
  createFields: [
    { key: "cidade", label: "Cidade", required: true },
    { key: "rua", label: "Rua", required: true },
    { key: "numero", label: "Número", type: "number", required: true, step: "1" },
    { key: "latitude", label: "Latitude", type: "number", required: true, step: "any" },
    { key: "longitude", label: "Longitude", type: "number", required: true, step: "any" },
  ],
  editFields: [
    { key: "cidade", label: "Cidade" },
    { key: "rua", label: "Rua" },
    { key: "numero", label: "Número", type: "number", step: "1" },
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
});
