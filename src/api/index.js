import { request } from "../lib/apiClient.js";
import { crudResource } from "../lib/crudResource.js";

/**
 * Ponto unico de acesso a API. Cada recurso "plano" ganha o CRUD generico;
 * `viagens` adiciona as 4 consultas complexas (3+ entidades) do back end.
 */
export const api = {
  ping: () => request("/"),

  motoristas: crudResource("motoristas"),
  passageiros: crudResource("passageiros"),
  veiculos: crudResource("veiculos"),
  localizacoes: crudResource("localizacoes"),

  viagens: {
    ...crudResource("viagens"),

    porModeloVeiculo: (modelo) =>
      request(`/viagens/veiculo/modelo/${encodeURIComponent(modelo)}`).then((r) => r?.data ?? []),

    porCidadePartida: (cidade) =>
      request(`/viagens/passageiro/cidade_partida/${encodeURIComponent(cidade)}`).then((r) => r?.data ?? []),

    porAno: (ano) =>
      request(`/viagens/ano/${encodeURIComponent(ano)}`).then((r) => r?.data ?? []),

    contagemPorPontoPartida: () =>
      request(`/viagens/ponto_partida/count`).then((r) => r?.data ?? []),
  },
};
