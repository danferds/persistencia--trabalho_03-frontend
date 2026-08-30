import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddRounded from "@mui/icons-material/AddRounded";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";

import CrudForm, { buildInitialValues } from "./CrudForm.jsx";
import { useNotify } from "../../context/NotifyContext.jsx";
import { errorMessage } from "../../lib/apiClient.js";

/** Cartao expansivel "Novo registro" com o formulario de criacao. */
export default function CrudCreateCard({ singular, fields, onCreate }) {
  const makeEmpty = () => buildInitialValues(fields, null);
  const [values, setValues] = useState(makeEmpty);
  const [busy, setBusy] = useState(false);
  const { notifyError } = useNotify();
  const formId = `create-${singular}`;

  const submit = async () => {
    setBusy(true);
    try {
      await onCreate(values);
      setValues(makeEmpty());
    } catch (err) {
      notifyError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Accordion disableGutters sx={{ border: "1px solid", borderColor: "divider" }}>
      <AccordionSummary expandIcon={<ExpandMoreRounded />}>
        <Typography sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
          <AddRounded fontSize="small" /> Novo {singular.toLowerCase()}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <CrudForm id={formId} fields={fields} values={values} onChange={setValues} onSubmit={submit} />
        <Button
          type="submit"
          form={formId}
          variant="contained"
          startIcon={<AddRounded />}
          disabled={busy}
          sx={{ mt: 2.5 }}
        >
          Adicionar {singular.toLowerCase()}
        </Button>
      </AccordionDetails>
    </Accordion>
  );
}
