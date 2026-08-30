import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { alpha } from "@mui/material/styles";
import SettingsRounded from "@mui/icons-material/SettingsRounded";

import BrandMark from "./BrandMark.jsx";

export default function MobileTopBar({ onOpenSettings }) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        backdropFilter: "blur(12px)",
        bgcolor: (t) => alpha(t.palette.background.default, 0.72),
        border: 0,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ gap: 1.5 }}>
        <BrandMark compact />
        <Box sx={{ flex: 1 }} />
        <IconButton color="inherit" onClick={onOpenSettings} aria-label="Configurar API">
          <SettingsRounded />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
