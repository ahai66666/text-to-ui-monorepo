import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "node:fs";
import path from "node:path";

const fileRuntimeFallbackPlugin = () => ({
  name: "copy-file-runtime-fallback",
  writeBundle(outputOptions) {
    const outputDir = outputOptions.dir ?? path.resolve(process.cwd(), "dist");
    fs.copyFileSync(
      path.resolve(process.cwd(), "runtime-file-fallback.js"),
      path.join(outputDir, "runtime-file-fallback.js")
    );
  }
});

const selfContainedCssPlugin = () => ({
  name: "self-contained-component-gallery-css",
  writeBundle(outputOptions) {
    const outputDir = outputOptions.dir ?? path.resolve(process.cwd(), "dist");
    const assetsDir = path.join(outputDir, "assets");
    if (!fs.existsSync(assetsDir)) return;
    for (const file of fs.readdirSync(assetsDir).filter((name) => name.endsWith(".css"))) {
      const target = path.join(assetsDir, file);
      const css = fs.readFileSync(target, "utf8");
      const unresolved = ["@import", "../../packages/", "../assets/design-system/", "./framework-runtime.css"]
        .filter((marker) => css.includes(marker));
      if (unresolved.length) {
        throw new Error(`${file} is not self-contained: ${unresolved.join(", ")}`);
      }
    }
  }
});

// The gallery has no modulepreload links that need a legacy fallback. Keeping
// Vite's MutationObserver polyfill out of the preview avoids an unnecessary
// runtime error in the embedded browser while preserving native module loading.
export default defineConfig({
  plugins: [vue(), fileRuntimeFallbackPlugin(), selfContainedCssPlugin()],
  build: {
    modulePreload: { polyfill: false },
    rollupOptions: {
      input: {
        main: "index.html",
        htmlRuntime: "framework-html.html",
        reactRuntime: "framework-react.html",
        vueRuntime: "framework-vue.html"
      }
    }
  }
});
