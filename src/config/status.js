/*
 * Rotulos e cores dos status de Viagem.
 * O enum do back end usa os valores 1..7. As cores sao nomes de paleta do MUI
 * (info, warning, success, error) usados diretamente pelo <Chip>.
 */
export const VIAGEM_STATUS = {
  1: { label: "Criada", color: "info" },
  2: { label: "Esperando", color: "warning" },
  3: { label: "Aceita", color: "info" },
  4: { label: "Iniciada", color: "warning" },
  5: { label: "Finalizada", color: "success" },
  6: { label: "Cancelada (motorista)", color: "error" },
  7: { label: "Cancelada (passageiro)", color: "error" },
};

/** Opcoes prontas para um <select> de status. */
export const VIAGEM_STATUS_OPTIONS = Object.entries(VIAGEM_STATUS).map(
  ([value, info]) => ({ value, label: info.label }),
);
