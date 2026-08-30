import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

/**
 * @typedef {object} FieldDef
 * @property {string} key
 * @property {string} label
 * @property {"text"|"email"|"password"|"number"|"select"} [type]
 * @property {boolean} [required]
 * @property {string} [step]         para inputs numericos
 * @property {string} [placeholder]
 * @property {Array<{value,label}>} [staticOptions]     select fixo
 * @property {() => Promise<Array<{value,label}>>} [options]  select assincrono
 * @property {(row) => string} [initial]  valor inicial ao editar
 */

/** Monta o objeto de valores iniciais de um formulario. */
export function buildInitialValues(fields, row) {
  const values = {};
  for (const field of fields) {
    values[field.key] = field.initial ? field.initial(row) : row?.[field.key] ?? "";
  }
  return values;
}

/** Carrega as opcoes assincronas dos campos select (uma vez). */
function useAsyncOptions(fields) {
  const hasAsync = fields.some((f) => typeof f.options === "function");
  const [optionsByKey, setOptionsByKey] = useState({});
  const [loading, setLoading] = useState(hasAsync);

  useEffect(() => {
    const asyncFields = fields.filter((f) => typeof f.options === "function");
    if (asyncFields.length === 0) return;

    let alive = true;
    setLoading(true);
    Promise.all(
      asyncFields.map((f) =>
        f
          .options()
          .then((opts) => [f.key, opts])
          .catch(() => [f.key, []]),
      ),
    ).then((pairs) => {
      if (!alive) return;
      setOptionsByKey(Object.fromEntries(pairs));
      setLoading(false);
    });

    return () => {
      alive = false;
    };
  }, [fields]);

  return {
    loading,
    optionsFor: (field) => field.staticOptions ?? optionsByKey[field.key] ?? [],
  };
}

/**
 * Formulario generico em grade de 2 colunas. Nao tem botao proprio: quem usa
 * coloca um <Button type="submit" form={id}> onde quiser.
 */
export default function CrudForm({ id, fields, values, onChange, onSubmit }) {
  const { loading, optionsFor } = useAsyncOptions(fields);

  const handleField = (key) => (event) =>
    onChange({ ...values, [key]: event.target.value });

  return (
    <Box
      component="form"
      id={id}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
      }}
    >
      {fields.map((field) => {
        const isSelect = field.type === "select";
        return (
          <TextField
            key={field.key}
            select={isSelect}
            type={isSelect ? undefined : field.type || "text"}
            label={field.label}
            required={!!field.required}
            placeholder={field.placeholder}
            value={values[field.key] ?? ""}
            onChange={handleField(field.key)}
            disabled={isSelect && loading && !field.staticOptions}
            inputProps={field.step ? { step: field.step } : undefined}
            fullWidth
          >
            {isSelect && [
              <MenuItem key="__placeholder" value="">
                {field.placeholder || "selecione…"}
              </MenuItem>,
              ...optionsFor(field).map((opt) => (
                <MenuItem key={String(opt.value)} value={String(opt.value)}>
                  {opt.label}
                </MenuItem>
              )),
            ]}
          </TextField>
        );
      })}
    </Box>
  );
}
