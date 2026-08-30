import { NavLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import SettingsRounded from "@mui/icons-material/SettingsRounded";

import BrandMark from "./BrandMark.jsx";
import { NAV_ITEMS } from "../../config/navigation.js";

function NavItem({ item }) {
  const { Icon } = item;
  return (
    <ListItemButton
      component={NavLink}
      to={item.path}
      end={item.path === "/"}
      sx={{
        borderRadius: 2,
        color: "text.secondary",
        "& .MuiListItemIcon-root": { minWidth: 38, color: "inherit" },
        "&:hover": { bgcolor: "action.hover", color: "text.primary" },
        "&.active": {
          bgcolor: "primary.main",
          color: "primary.contrastText",
          "&:hover": { bgcolor: "primary.main" },
        },
      }}
    >
      <ListItemIcon>
        <Icon fontSize="small" />
      </ListItemIcon>
      <ListItemText primaryTypographyProps={{ fontWeight: 600, fontSize: "0.92rem" }}>
        {item.label}
      </ListItemText>
    </ListItemButton>
  );
}

export default function SideNav({ width, onOpenSettings }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width,
          boxSizing: "border-box",
          border: 0,
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      <Stack sx={{ height: "100%", p: 2 }}>
        <Stack direction="row" alignItems="center" sx={{ px: 1, py: 1.5 }}>
          <BrandMark />
          <Box sx={{ flex: 1 }} />
          <Tooltip title="Configurar API">
            <IconButton size="small" onClick={onOpenSettings} aria-label="Configurar API">
              <SettingsRounded fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        <List sx={{ mt: 1, flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </List>
      </Stack>
    </Drawer>
  );
}
