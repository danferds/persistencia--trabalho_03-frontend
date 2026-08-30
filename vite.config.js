import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev server na mesma porta que o projeto usava antes (5500).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5500,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        // separa o vendor pesado (React + MUI) do codigo da aplicacao
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          mui: ["@mui/material", "@mui/icons-material", "@emotion/react", "@emotion/styled"],
        },
      },
    },
  },
});
