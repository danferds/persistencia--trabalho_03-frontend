// URL base da API FastAPI (back end deste mesmo trabalho).
// Pode ser sobrescrita em runtime salvando "apiBaseUrl" no localStorage.
export const DEFAULT_API_BASE_URL = "http://localhost:8000";

export function getApiBaseUrl() {
  try {
    return localStorage.getItem("apiBaseUrl") || DEFAULT_API_BASE_URL;
  } catch {
    return DEFAULT_API_BASE_URL;
  }
}

export function setApiBaseUrl(url) {
  try {
    localStorage.setItem("apiBaseUrl", url.replace(/\/+$/, ""));
  } catch {
    /* ignora */
  }
}

// Rótulos dos status de Viagem (enum do back end: valores 1..7).
export const VIAGEM_STATUS = {
  1: { label: "Criada", badge: "info" },
  2: { label: "Esperando", badge: "warn" },
  3: { label: "Aceita", badge: "info" },
  4: { label: "Iniciada", badge: "warn" },
  5: { label: "Finalizada", badge: "ok" },
  6: { label: "Cancelada (motorista)", badge: "danger" },
  7: { label: "Cancelada (passageiro)", badge: "danger" },
};
