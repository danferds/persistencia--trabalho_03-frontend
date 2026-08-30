import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

export default function LoadingState({ label = "carregando" }) {
  return (
    <Stack alignItems="center" sx={{ py: 6 }}>
      <CircularProgress size={30} aria-label={label} />
    </Stack>
  );
}
