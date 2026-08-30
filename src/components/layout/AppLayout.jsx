import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import SideNav from "./SideNav.jsx";
import MobileTopBar from "./MobileTopBar.jsx";
import BottomNav from "./BottomNav.jsx";
import SettingsDialog from "../../features/settings/SettingsDialog.jsx";
import { matchNavItem } from "../../config/navigation.js";

const SIDEBAR_WIDTH = 248;

/**
 * Casca do app:
 *  - desktop (md+): sidebar fixa a esquerda
 *  - mobile: AppBar no topo + BottomNavigation estilo app
 */
export default function AppLayout({ children }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const item = matchNavItem(pathname);
    document.title = item ? `${item.label} · Bora` : "Bora";
  }, [pathname]);

  const openSettings = () => setSettingsOpen(true);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "background.default" }}>
      {isDesktop && <SideNav width={SIDEBAR_WIDTH} onOpenSettings={openSettings} />}

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          pb: isDesktop ? 0 : "calc(76px + env(safe-area-inset-bottom))",
        }}
      >
        {!isDesktop && <MobileTopBar onOpenSettings={openSettings} />}

        <Box
          sx={{
            width: "100%",
            maxWidth: 1200,
            mx: "auto",
            flex: 1,
            px: { xs: 2, sm: 3, lg: 5 },
            py: { xs: 3, md: 4 },
          }}
        >
          {children}
        </Box>
      </Box>

      {!isDesktop && <BottomNav onOpenSettings={openSettings} />}

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </Box>
  );
}
