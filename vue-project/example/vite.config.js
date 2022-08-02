import { fileURLToPath, URL } from "node:url";

import { defineConfig, searchForWorkspaceRoot } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    fs: {
      // strict: false,
      allow: [searchForWorkspaceRoot(process.cwd()), "../../src"],
    },
  },
});
