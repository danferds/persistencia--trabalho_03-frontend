import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { getApiBaseUrl, setApiBaseUrl } from "../lib/apiConfig.js";

const ApiConfigContext = createContext(null);

export function ApiConfigProvider({ children }) {
  const [baseUrl, setBaseUrlState] = useState(getApiBaseUrl);

  const setBaseUrl = useCallback((url) => {
    setBaseUrlState(setApiBaseUrl(url));
  }, []);

  const value = useMemo(() => ({ baseUrl, setBaseUrl }), [baseUrl, setBaseUrl]);

  return <ApiConfigContext.Provider value={value}>{children}</ApiConfigContext.Provider>;
}

export function useApiConfig() {
  const ctx = useContext(ApiConfigContext);
  if (!ctx) throw new Error("useApiConfig precisa estar dentro de <ApiConfigProvider>");
  return ctx;
}
