import Chip from "@mui/material/Chip";

import { VIAGEM_STATUS } from "../../config/status.js";

/** Chip colorido para o status de uma viagem (enum 1..7). */
export default function StatusChip({ status }) {
  const info = VIAGEM_STATUS[status] || { label: `#${status}`, color: "default" };
  return <Chip size="small" color={info.color} label={info.label} />;
}
