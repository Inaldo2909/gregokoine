import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",   // caminhos relativos: funciona na raiz, em subpasta ou no GitHub Pages
  build: { outDir: "dist" },
});
