import { getApiBaseUrl } from "./config.js";

/**
 * Cliente HTTP para a API do Trabalho 3 (FastAPI + Beanie + MongoDB).
 *
 * Observações importantes sobre o back end:
 *  - Os endpoints de criação (POST) e atualização (PUT) recebem os dados como
 *    *query parameters*, e não como corpo JSON.
 *  - Os endpoints `/{recurso}/filter` recebem o filtro como corpo JSON e
 *    `page` / `page_size` / `sort_by` como query params.
 *  - Respostas seguem os schemas `BaseResponse` e `PagedBaseResponse`.
 */

class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function buildQuery(params = {}) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      value.forEach((v) => qs.append(key, v));
    } else {
      qs.append(key, value);
    }
  }
  const str = qs.toString();
  return str ? `?${str}` : "";
}

async function request(path, { method = "GET", query, body } = {}) {
  const url = `${getApiBaseUrl()}${path}${buildQuery(query)}`;
  const opts = { method, headers: {} };
  if (body !== undefined) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(url, opts);
  } catch (err) {
    throw new ApiError(
      `Falha de conexão com a API (${getApiBaseUrl()}). O back end está rodando?`,
      0,
      err
    );
  }

  let payload = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!res.ok) {
    const msg =
      (payload && (payload.message || payload.detail)) ||
      `Erro ${res.status} ao chamar ${path}`;
    throw new ApiError(msg, res.status, payload);
  }

  // O back end às vezes devolve 200 com { success: false, message }.
  if (payload && payload.success === false) {
    throw new ApiError(payload.message || "Operação falhou", res.status, payload);
  }

  return payload;
}

/* ------------------------------------------------------------------ */
/* Fábrica de CRUD genérico para os recursos "planos"                 */
/* ------------------------------------------------------------------ */
function crudResource(resource) {
  return {
    count: () => request(`/${resource}/count`).then((r) => r?.data ?? 0),

    get: (id) => request(`/${resource}/${encodeURIComponent(id)}`).then((r) => r?.data),

    create: (params) => request(`/${resource}`, { method: "POST", query: params }),

    update: (id, params) =>
      request(`/${resource}/${encodeURIComponent(id)}`, { method: "PUT", query: params }),

    remove: (id) =>
      request(`/${resource}/${encodeURIComponent(id)}`, { method: "DELETE" }),

    /**
     * @param {object}  opts
     * @param {object}  opts.filter    ex.: { nome: { $regex: "ana" } }
     * @param {[string,string]} opts.sortBy  ex.: ["nome", "asc"]
     * @param {number}  opts.page
     * @param {number}  opts.pageSize
     */
    filter: ({ filter = {}, sortBy = null, page = 1, pageSize = 10 } = {}) =>
      request(`/${resource}/filter`, {
        method: "POST",
        body: filter,
        query: {
          page,
          page_size: pageSize,
          ...(sortBy ? { sort_by: sortBy } : {}),
        },
      }),
  };
}

export const api = {
  ping: () => request("/"),

  motoristas: crudResource("motoristas"),
  passageiros: crudResource("passageiros"),
  veiculos: crudResource("veiculos"),
  localizacoes: crudResource("localizacoes"),
  viagens: {
    ...crudResource("viagens"),
    // Consultas complexas (3+ entidades) expostas pelo back end.
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

export { ApiError };
