import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  base: "/",                  // quan trọng để build đúng đường dẫn
  server: {
    port: 5173,
    open: true
  },
  preview: {
    port: 3000
  },
  build: {
    outDir: "dist",           // Render sẽ publish dist
    sourcemap: false,         // có thể bật true nếu debug
    chunkSizeWarningLimit: 600
  }
});
