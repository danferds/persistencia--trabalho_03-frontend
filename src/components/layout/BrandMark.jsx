import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NearMeRounded from "@mui/icons-material/NearMeRounded";

/**
 * Logo + wordmark do app ("Bora"). `compact` reduz para uso na AppBar do mobile.
 */
export default function BrandMark({ compact = false }) {
  const size = compact ? 34 : 40;

  return (
    <Stack direction="row" spacing={compact ? 1 : 1.5} alignItems="center">
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: compact ? 2 : 2.5,
          display: "grid",
          placeItems: "center",
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        <NearMeRounded fontSize={compact ? "small" : "medium"} />
      </Box>

      {compact ? (
        <Typography sx={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.03em" }}>
          Bora
        </Typography>
      ) : (
        <Box>
          <Typography
            sx={{ fontWeight: 800, fontSize: "1.3rem", lineHeight: 1, letterSpacing: "-0.03em" }}
          >
            Bora
          </Typography>
          <Typography
            variant="overline"
            sx={{ display: "block", mt: 0.25, lineHeight: 1, color: "text.secondary", fontSize: "0.58rem" }}
          >
            mobilidade urbana
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
