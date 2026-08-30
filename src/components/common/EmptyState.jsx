import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import InboxRounded from "@mui/icons-material/InboxRounded";

export default function EmptyState({ message = "Nenhum registro encontrado.", icon }) {
  return (
    <Stack alignItems="center" spacing={1.5} sx={{ py: 6, px: 2, color: "text.secondary", textAlign: "center" }}>
      {icon ?? <InboxRounded sx={{ fontSize: 40, opacity: 0.5 }} />}
      <Typography variant="body2">{message}</Typography>
    </Stack>
  );
}
