import SpaceDashboardRounded from "@mui/icons-material/SpaceDashboardRounded";
import BadgeRounded from "@mui/icons-material/BadgeRounded";
import GroupsRounded from "@mui/icons-material/GroupsRounded";
import DirectionsCarFilledRounded from "@mui/icons-material/DirectionsCarFilledRounded";
import PlaceRounded from "@mui/icons-material/PlaceRounded";
import RouteRounded from "@mui/icons-material/RouteRounded";
import InsightsRounded from "@mui/icons-material/InsightsRounded";

/*
 * Itens de navegacao. `primary: true` -> aparece direto na barra inferior do
 * mobile; os demais ficam no menu "Mais".
 */
export const NAV_ITEMS = [
  { path: "/", label: "Painel", Icon: SpaceDashboardRounded, primary: true },
  { path: "/motoristas", label: "Motoristas", Icon: BadgeRounded, primary: true },
  { path: "/passageiros", label: "Passageiros", Icon: GroupsRounded, primary: true },
  { path: "/veiculos", label: "Veiculos", Icon: DirectionsCarFilledRounded, primary: false },
  { path: "/localizacoes", label: "Localizacoes", Icon: PlaceRounded, primary: false },
  { path: "/viagens", label: "Viagens", Icon: RouteRounded, primary: true },
  { path: "/consultas", label: "Consultas", Icon: InsightsRounded, primary: false },
];

/** Item de nav correspondente a um pathname (trata "/" separadamente). */
export function matchNavItem(pathname) {
  return NAV_ITEMS.find((item) =>
    item.path === "/" ? pathname === "/" : pathname.startsWith(item.path),
  );
}
