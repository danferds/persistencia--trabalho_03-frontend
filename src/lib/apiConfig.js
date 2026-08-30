/*
 * URL base da API FastAPI (back end do Trabalho 3).
 *
 * Ordem de prioridade:
 *   1. localStorage "apiBaseUrl"  (definido pelo botao "Configurar API")
 *   2. import.meta.env.VITE_API_BASE_URL  (arquivo .env em build)
 *   3. http://localhost:8000
 */

const STORAGE_KEY = "apiBaseUrl";

export const DEFAULT_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export function getApiBaseUrl() {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_API_BASE_URL;
  } catch {
    return DEFAULT_API_BASE_URL;
  }
}

/** Normaliza (remove barras finais) e persiste. Retorna o valor salvo. */
export function setApiBaseUrl(url) {
  const clean = String(url || "").trim().replace(/\/+$/, "") || DEFAULT_API_BASE_URL;
  try {
    localStorage.setItem(STORAGE_KEY, clean);
  } catch {
    /* ignora ambientes sem localStorage */
  }
  return clean;
}
