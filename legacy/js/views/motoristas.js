import { api } from "../api.js";
import { fmtDate, idCell } from "../ui.js";
import { createCrudView } from "./crudView.js";

export const motoristasView = createCrudView({
  resource: api.motoristas,
  title: "Motoristas",
  subtitle: "Cadastro dos motoristas parceiros da plataforma.",
  searchFields: [
    { value: "nome", label: "Nome" },
    { value: "email", label: "E-mail" },
    { value: "cpf", label: "CPF" },
  ],
  columns: [
    { key: "_id", label: "ID", render: (r) => idCell(r._id ?? r.id) },
    { key: "nome", label: "Nome" },
    { key: "cpf", label: "CPF" },
    { key: "email", label: "E-mail" },
    { key: "criado_em", label: "Criado em", render: (r) => fmtDate(r.criado_em) },
  ],
  createFields: [
    { key: "cpf", label: "CPF", required: true },
    { key: "nome", label: "Nome", required: true },
    { key: "email", label: "E-mail", type: "email", required: true },
    { key: "senha", label: "Senha", type: "password", required: true },
  ],
  editFields: [
    { key: "nome", label: "Nome" },
    { key: "email", label: "E-mail", type: "email" },
    { key: "senha", label: "Senha", type: "password", placeholder: "(deixe em branco p/ manter)" },
  ],
  toCreateParams: (f) => ({ cpf: f.cpf, nome: f.nome, email: f.email, senha: f.senha }),
  toEditParams: (f) => {
    const p = {};
    if (f.nome) p.nome = f.nome;
    if (f.email) p.email = f.email;
    if (f.senha) p.senha = f.senha;
    return p;
  },
});
