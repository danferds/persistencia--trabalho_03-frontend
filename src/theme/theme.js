import { createTheme, alpha } from "@mui/material/styles";

/* ============================================================
   Tema Material UI claro, inspirado no visual atual do Uber:
   fundo quase branco, preto/branco de alto contraste, botoes
   solidos pretos, cantos generosos e tipografia forte.
   ============================================================ */

const INK = "#0B0B0C";
const PAGE_BG = "#F6F6F7";
const SURFACE = "#FFFFFF";
const SURFACE_INPUT = "#F1F1F3";
const BORDER = "rgba(11, 11, 12, 0.12)";
const GO_GREEN = "#0FA45C"; // acento "seguir viagem"
const SIGNAL_YELLOW = "#F5B301"; // acento estilo 99

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: INK, contrastText: "#FFFFFF" },
    secondary: { main: GO_GREEN, contrastText: "#FFFFFF" },
    success: { main: GO_GREEN, contrastText: "#FFFFFF" },
    warning: { main: SIGNAL_YELLOW, contrastText: "#231B00" },
    error: { main: "#E5484D" },
    info: { main: "#2E77F0" },
    background: { default: PAGE_BG, paper: SURFACE },
    divider: BORDER,
    text: {
      primary: INK,
      secondary: "rgba(11, 11, 12, 0.60)",
      disabled: "rgba(11, 11, 12, 0.38)",
    },
  },

  shape: { borderRadius: 14 },

  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-0.03em" },
    h2: { fontWeight: 800, letterSpacing: "-0.025em" },
    h3: { fontWeight: 800, letterSpacing: "-0.02em" },
    h4: { fontWeight: 800, letterSpacing: "-0.02em" },
    h5: { fontWeight: 700, letterSpacing: "-0.01em" },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { fontWeight: 700, textTransform: "none", letterSpacing: 0 },
    overline: { fontWeight: 700, letterSpacing: "0.14em", fontSize: "0.7rem" },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: "100vh",
          backgroundColor: PAGE_BG,
          backgroundImage: `radial-gradient(1000px 520px at 100% -10%, ${alpha(GO_GREEN, 0.06)}, transparent 60%), radial-gradient(760px 480px at -10% 110%, ${alpha("#2E77F0", 0.06)}, transparent 55%)`,
          backgroundAttachment: "fixed",
        },
        "::selection": { background: alpha(GO_GREEN, 0.22) },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none", border: `1px solid ${BORDER}` },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { borderRadius: 18 } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 12, paddingInline: 18, paddingBlock: 9 },
        sizeLarge: { paddingBlock: 12, paddingInline: 22, fontSize: "1rem" },
        containedPrimary: { "&:hover": { backgroundColor: "#2A2A2E" } },
        outlinedInherit: { borderColor: BORDER },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: SURFACE_INPUT,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: BORDER },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: BORDER },
        head: {
          fontWeight: 700,
          fontSize: "0.7rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(11, 11, 12, 0.55)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: { paper: { backgroundColor: SURFACE } },
    },
    MuiAccordion: {
      styleOverrides: {
        root: { borderRadius: 18, "&:before": { display: "none" } },
      },
    },
    MuiTooltip: {
      styleOverrides: { tooltip: { fontSize: "0.75rem", borderRadius: 8 } },
    },
  },
});
