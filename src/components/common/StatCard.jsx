import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

/** Cartao de metrica do painel: icone + rotulo + numero grande. */
export default function StatCard({ label, value, Icon, loading = false }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: "action.hover",
              color: "secondary.main",
            }}
          >
            {Icon && <Icon fontSize="small" />}
          </Box>
          <Typography variant="overline" color="text.secondary" noWrap>
            {label}
          </Typography>
        </Stack>

        {loading ? (
          <Skeleton variant="rounded" width={72} height={40} />
        ) : (
          <Typography
            sx={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}
          >
            {value ?? "—"}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
