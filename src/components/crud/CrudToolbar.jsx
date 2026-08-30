import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import CloseRounded from "@mui/icons-material/CloseRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";

const PAGE_SIZES = [5, 10, 20, 50];
const controlSx = { flex: "1 1 170px", minWidth: 130 };

/** Barra de busca + ordenacao + tamanho de pagina de uma tela CRUD. */
export default function CrudToolbar({ config, crud }) {
  const [term, setTerm] = useState(crud.searchTerm);

  // mantem o input sincronizado se a busca for limpa por fora
  useEffect(() => setTerm(crud.searchTerm), [crud.searchTerm]);

  const applySearch = (event) => {
    event?.preventDefault();
    crud.applySearch(term.trim());
  };
  const clearSearch = () => {
    setTerm("");
    crud.applySearch("");
  };

  return (
    <Box
      component="form"
      onSubmit={applySearch}
      sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "flex-start", mb: 3 }}
    >
      <TextField
        select
        label="Campo"
        value={crud.searchField}
        onChange={(e) => crud.setSearchField(e.target.value)}
        sx={controlSx}
      >
        {config.searchFields.map((f) => (
          <MenuItem key={f.value} value={f.value}>
            {f.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Buscar"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        sx={{ flex: "2 1 220px", minWidth: 180 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRounded fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: term ? (
            <IconButton size="small" onClick={clearSearch} aria-label="Limpar busca">
              <CloseRounded fontSize="small" />
            </IconButton>
          ) : null,
        }}
      />

      <Button type="submit" variant="contained" sx={{ flex: "0 0 auto", py: 1 }}>
        Buscar
      </Button>

      <TextField
        select
        label="Ordenar por"
        value={crud.sortField}
        onChange={(e) => crud.setSortField(e.target.value)}
        sx={controlSx}
      >
        <MenuItem value="">— sem ordenacao —</MenuItem>
        {config.searchFields.map((f) => (
          <MenuItem key={f.value} value={f.value}>
            {f.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Direcao"
        value={crud.sortDir}
        onChange={(e) => crud.setSortDir(e.target.value)}
        disabled={!crud.sortField}
        sx={controlSx}
      >
        <MenuItem value="asc">Crescente</MenuItem>
        <MenuItem value="desc">Decrescente</MenuItem>
      </TextField>

      <TextField
        select
        label="Por pagina"
        value={crud.pageSize}
        onChange={(e) => crud.setPageSize(Number(e.target.value))}
        sx={controlSx}
      >
        {PAGE_SIZES.map((n) => (
          <MenuItem key={n} value={n}>
            {n} / pagina
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
