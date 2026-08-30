import { api } from "../../api/index.js";

/**
 * As 4 consultas complexas (3+ entidades) expostas pelo back end.
 * Cada item vira um <QueryBlock>: titulo, descricao, inputs e a funcao `run`.
 */
export const CONSULTAS = [
  {
    id: "modelo-veiculo",
    title: "Viagens por modelo de veiculo",
    description: "Relaciona viagem -> motorista -> veiculo -> localizacao de partida.",
    inputs: [{ key: "modelo", label: "Modelo do veiculo", placeholder: "ex.: Onix" }],
    run: ({ modelo }) => api.viagens.porModeloVeiculo(modelo),
    labels: {
      motorista_nome: "Motorista",
      veiculo_placa: "Placa",
      veiculo_modelo: "Modelo",
      cidade_partida: "Cidade de partida",
    },
  },
  {
    id: "cidade-partida",
    title: "Viagens por cidade de partida",
    description: "Relaciona viagem -> passageiro -> localizacao inicial -> localizacao final.",
    inputs: [{ key: "cidade", label: "Cidade de partida", placeholder: "ex.: Fortaleza" }],
    run: ({ cidade }) => api.viagens.porCidadePartida(cidade),
    labels: {
      passageiro_nome: "Passageiro",
      cidade_partida: "Partida",
      cidade_chegada: "Chegada",
    },
  },
  {
    id: "por-ano",
    title: "Total de viagens por ano",
    description: "Agrupa as viagens criadas no ano informado.",
    inputs: [{ key: "ano", label: "Ano", type: "number", placeholder: "ex.: 2026" }],
    run: ({ ano }) => api.viagens.porAno(ano),
    labels: { ano: "Ano", total: "Total", _id: "Data" },
  },
  {
    id: "ponto-partida",
    title: "Contagem de viagens por ponto de partida",
    description: "Agrupa todas as viagens pela cidade da localizacao inicial.",
    inputs: [],
    run: () => api.viagens.contagemPorPontoPartida(),
    labels: { ponto_partida: "Ponto de partida", total: "Total" },
  },
];
