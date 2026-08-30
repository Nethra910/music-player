import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // Fix: change 'react-plugin' to 'plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
