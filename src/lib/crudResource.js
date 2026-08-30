import { request } from "./apiClient.js";

/**
 * Fabrica o conjunto de operacoes CRUD de um recurso "plano" da API.
 *
 * @param {string} resource  ex.: "motoristas"
 */
export function crudResource(resource) {
  const base = `/${resource}`;

  return {
    count: () => request(`${base}/count`).then((r) => r?.data ?? 0),

    get: (id) => request(`${base}/${encodeURIComponent(id)}`).then((r) => r?.data),

    create: (params) => request(base, { method: "POST", query: params }),

    update: (id, params) =>
      request(`${base}/${encodeURIComponent(id)}`, { method: "PUT", query: params }),

    remove: (id) =>
      request(`${base}/${encodeURIComponent(id)}`, { method: "DELETE" }),

    /**
     * @param {object} opts
     * @param {object} [opts.filter]   ex.: { nome: { $regex: "ana" } }
     * @param {[string, "asc"|"desc"]|null} [opts.sortBy]
     * @param {number} [opts.page]
     * @param {number} [opts.pageSize]
     */
    filter: ({ filter = {}, sortBy = null, page = 1, pageSize = 10 } = {}) =>
      request(`${base}/filter`, {
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
