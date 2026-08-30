/** Data ISO -> dd/mm/aaaa (pt-BR). Vazio vira "—". */
export function fmtDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("pt-BR");
  } catch {
    return String(value);
  }
}

/** Encurta um ObjectId longo para exibicao em tabela. */
export function shortId(id) {
  if (!id) return "—";
  const s = String(id);
  return s.length > 10 ? `${s.slice(0, 8)}…` : s;
}

/** Converte qualquer valor de celula em texto exibivel. */
export function formatCell(value) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
