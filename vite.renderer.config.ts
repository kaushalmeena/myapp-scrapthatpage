import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { ConfigEnv, UserConfig } from "vite";
import { defineConfig } from "vite";
import { pluginExposeRenderer } from "./vite.base.config";

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<"renderer">;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? "";

  return {
    root,
    mode,
    base: "./",
    build: {
      outDir: `.vite/renderer/${name}`
    },
    plugins: [pluginExposeRenderer(name), react(), tailwindcss()],
    resolve: {
      preserveSymlinks: true,
      alias: {
        "@": path.resolve(__dirname, "src/renderer"),
        "@common": path.resolve(__dirname, "src/common")
      }
    },
    clearScreen: false
  } as UserConfig;
});
