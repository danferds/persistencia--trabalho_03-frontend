import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { errorMessage } from "../lib/apiClient.js";

const NUMERIC_OPS = ["$eq", "$gt", "$lt", "$gte", "$lte"];

/**
 * Estado + carregamento da listagem de um CRUD: busca, ordenacao e paginacao.
 * A UI apenas consome `rows` / `loading` / `error` e chama os setters.
 *
 * @param {object} config  mesma config usada por <CrudPage> (precisa de
 *                          `resource` e `searchFields`).
 */
export function useCrudResource(config) {
  const { resource, searchFields } = config;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(10);
  const [sortField, setSortFieldState] = useState(""); // "" = sem ordenacao
  const [sortDir, setSortDirState] = useState("asc");
  const [searchField, setSearchField] = useState(searchFields[0]?.value ?? "");
  const [searchTerm, setSearchTerm] = useState("");
  const [nonce, setNonce] = useState(0); // forca recarga sem mudar filtros

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const requestIdRef = useRef(0);

  // Monta o objeto de filtro no formato que o back end espera.
  const filter = useMemo(() => {
    const term = searchTerm.trim();
    if (!term) return {};
    const def = searchFields.find((f) => f.value === searchField);
    const op = def?.op || "$regex";
    let value = term;
    if (NUMERIC_OPS.includes(op)) {
      const n = Number(term);
      value = Number.isNaN(n) ? term : n;
    }
    return { [searchField]: { [op]: value } };
  }, [searchTerm, searchField, searchFields]);

  const load = useCallback(async () => {
    const id = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const res = await resource.filter({
        filter,
        sortBy: sortField ? [sortField, sortDir] : null,
        page,
        pageSize,
      });
      if (id !== requestIdRef.current) return; // resposta obsoleta
      setRows(res?.data ?? []);
    } catch (err) {
      if (id !== requestIdRef.current) return;
      setError(errorMessage(err));
      setRows([]);
    } finally {
      if (id === requestIdRef.current) setLoading(false);
    }
  }, [resource, filter, sortField, sortDir, page, pageSize, nonce]);

  useEffect(() => {
    load();
  }, [load]);

  /* --- setters que sempre voltam para a primeira pagina --- */
  const setPageSize = useCallback((n) => {
    setPageSizeState(n);
    setPage(1);
  }, []);
  const setSortField = useCallback((v) => {
    setSortFieldState(v);
    setPage(1);
  }, []);
  const setSortDir = useCallback((v) => {
    setSortDirState(v);
    setPage(1);
  }, []);
  const applySearch = useCallback((term) => {
    setSearchTerm(term);
    setPage(1);
  }, []);

  /** Recarrega mantendo a pagina atual (usado apos editar/excluir). */
  const reload = useCallback(() => setNonce((n) => n + 1), []);
  /** Volta para a pagina 1 e recarrega (usado apos criar). */
  const refresh = useCallback(() => {
    setPage(1);
    setNonce((n) => n + 1);
  }, []);

  return {
    rows,
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    sortField,
    setSortField,
    sortDir,
    setSortDir,
    searchField,
    setSearchField,
    searchTerm,
    applySearch,
    reload,
    refresh,
    // heuristica: pagina cheia => provavelmente ha proxima
    hasNextPage: rows.length === pageSize,
  };
}
