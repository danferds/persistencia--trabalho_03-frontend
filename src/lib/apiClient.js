import { getApiBaseUrl } from "./apiConfig.js";

/**
 * Cliente HTTP para a API do Trabalho 3 (FastAPI + Beanie + MongoDB).
 *
 * Peculiaridades do back end:
 *  - POST (criar) e PUT (atualizar) recebem os dados como *query params*.
 *  - `/{recurso}/filter` recebe o filtro no corpo JSON e
 *    `page` / `page_size` / `sort_by` na query string.
 *  - Respostas seguem os schemas `BaseResponse` / `PagedBaseResponse` e as
 *    vezes devolvem 200 com `{ success: false, message }`.
 */

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

/** Mensagem amigavel a partir de qualquer erro lancado pelo cliente. */
export function errorMessage(err) {
  if (err instanceof ApiError) return err.message;
  return err?.message || "Erro inesperado.";
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

export async function request(path, { method = "GET", query, body } = {}) {
  const base = getApiBaseUrl();
  const url = `${base}${path}${buildQuery(query)}`;
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
      `Falha de conexao com a API (${base}). O back end esta rodando?`,
      0,
      err,
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
    const raw =
      (payload && (payload.message || payload.detail)) ||
      `Erro ${res.status} ao chamar ${path}`;
    throw new ApiError(typeof raw === "string" ? raw : JSON.stringify(raw), res.status, payload);
  }

  if (payload && payload.success === false) {
    throw new ApiError(payload.message || "Operacao falhou", res.status, payload);
  }

  return payload;
}
