import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.BASE_PATH || "/inori-content-wiki/",
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  define: {
    "process.env.SOOP_CHANNEL_ID": JSON.stringify("inorisama"),
    "process.env.SOOP_API_BASE": JSON.stringify("https://chapi.sooplive.com/api"),
  },
  server: { host: "0.0.0.0" },
});
