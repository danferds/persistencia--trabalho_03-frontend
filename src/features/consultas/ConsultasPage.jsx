import Stack from "@mui/material/Stack";

import PageHeader from "../../components/common/PageHeader.jsx";
import QueryBlock from "./QueryBlock.jsx";
import { CONSULTAS } from "./queries.js";

export default function ConsultasPage() {
  return (
    <>
      <PageHeader
        title="Consultas complexas"
        subtitle="Consultas que envolvem multiplas entidades (motorista, veiculo, passageiro, localizacao e viagem)."
      />
      <Stack spacing={3}>
        {CONSULTAS.map((consulta) => (
          <QueryBlock key={consulta.id} consulta={consulta} />
        ))}
      </Stack>
    </>
  );
}
