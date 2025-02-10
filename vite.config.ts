import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

// Convert import.meta.url to a file path
const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(({ command, mode }) => {
  const isExtension = mode === "extension";

  return {
    plugins: [react(), tailwindcss()],
    build: {
      outDir: isExtension ? "dist/extension" : "dist/web",
      rollupOptions: {
        input: isExtension
          ? {
            main: resolve(__dirname, "popup.html"), // Add this line
              popup: resolve(__dirname, "src/extension/popup.tsx"),
              background: resolve(__dirname, "src/extension/background.ts"),
              contentScript: resolve(
                __dirname,
                "src/extension/contentScript.ts",
              ),
            }
          : {
            web: resolve(__dirname, "src/web/main.tsx"),
            index: resolve(__dirname, "index.html"), // Add this line
            },
        output: {
          entryFileNames: "[name].js",
          // chunkFileNames: "assets/[name].js",
          // assetFileNames: "assets/[name].[ext]",
        },
      },
    },
    server: {
      port: 3000,
    },
    resolve: {
      alias: [{
        find: "@",
        replacement: resolve(__dirname, "src"),
      }],
    },
  };
});
