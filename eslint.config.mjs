import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";

export default defineConfig(
  globalIgnores([".vite/**", "out/**", "dist/**", "node_modules/**"]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  reactHooks.configs.flat["recommended-latest"],
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.electron,
  importPlugin.flatConfigs.typescript,
  prettierRecommended,
  {
    settings: {
      react: { version: "detect" }
    }
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // Magic constants injected by Forge's Vite plugin (see forge.env.d.ts)
        MAIN_WINDOW_VITE_DEV_SERVER_URL: "readonly",
        MAIN_WINDOW_VITE_NAME: "readonly"
      }
    },
    rules: {
      // TypeScript already covers prop typing.
      "react/prop-types": "off",
      // Dexie's default export is the `Dexie` class, which is also a named
      // export; importing it as `Dexie` is intentional, not a mistake.
      "import/no-named-as-default": "off"
    }
  },
  {
    // Build/config files import tooling packages (vite, @vitejs/plugin-react,
    // @electron/fuses, typescript-eslint) that use `exports` maps which
    // eslint-plugin-import's resolver can't follow. TypeScript validates these
    // imports, so the rule only produces false positives here.
    files: ["forge.config.ts", "vite.*.ts", "eslint.config.mjs"],
    rules: {
      "import/no-unresolved": "off"
    }
  }
);
