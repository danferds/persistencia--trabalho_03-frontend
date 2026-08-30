import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import MoreHorizRounded from "@mui/icons-material/MoreHorizRounded";
import SettingsRounded from "@mui/icons-material/SettingsRounded";

import { NAV_ITEMS, matchNavItem } from "../../config/navigation.js";

const PRIMARY = NAV_ITEMS.filter((i) => i.primary);
const OVERFLOW = NAV_ITEMS.filter((i) => !i.primary);
const MORE = "__more__";

/** Barra inferior estilo app (Uber/99): destinos principais + menu "Mais". */
export default function BottomNav({ onOpenSettings }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const activePath = matchNavItem(pathname)?.path;
  const value = PRIMARY.some((i) => i.path === activePath) ? activePath : MORE;

  const handleChange = (_event, next) => {
    if (next !== MORE) navigate(next);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: (t) => t.zIndex.appBar,
        borderRadius: 0,
        border: 0,
        borderTop: "1px solid",
        borderColor: "divider",
        pb: "env(safe-area-inset-bottom)",
      }}
    >
      <BottomNavigation showLabels value={value} onChange={handleChange}>
        {PRIMARY.map((item) => (
          <BottomNavigationAction
            key={item.path}
            value={item.path}
            label={item.label}
            icon={<item.Icon />}
          />
        ))}
        <BottomNavigationAction
          value={MORE}
          label="Mais"
          icon={<MoreHorizRounded />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        />
      </BottomNavigation>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {OVERFLOW.map((item) => (
          <MenuItem
            key={item.path}
            selected={item.path === activePath}
            onClick={() => {
              setAnchorEl(null);
              navigate(item.path);
            }}
          >
            <ListItemIcon>
              <item.Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onOpenSettings();
          }}
        >
          <ListItemIcon>
            <SettingsRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText>Configurar API</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
}
