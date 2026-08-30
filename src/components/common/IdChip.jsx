import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

import { shortId } from "../../utils/format.js";

/** Exibe um ObjectId encurtado, com o valor completo no tooltip. */
export default function IdChip({ id }) {
  return (
    <Tooltip title={id ? String(id) : ""}>
      <Box
        component="code"
        sx={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: "0.78rem",
          px: 1,
          py: 0.25,
          borderRadius: 1,
          bgcolor: "action.hover",
          color: "text.secondary",
          userSelect: "all",
        }}
      >
        {shortId(id)}
      </Box>
    </Tooltip>
  );
}
