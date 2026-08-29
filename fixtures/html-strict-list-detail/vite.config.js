import path from "node:path";

export default {
  resolve: {
    alias: {
      "@text-to-ui/components-html/styles.css": path.resolve("../../packages/components-html/src/styles.css"),
      "@text-to-ui/components-html": path.resolve("../../packages/components-html/src/index.js"),
      "@text-to-ui/tokens": path.resolve("../../packages/tokens/src/index.css")
    }
  }
};
