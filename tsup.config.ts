
// import { defineConfig } from "tsup";

// export default defineConfig({
//   entry: ["src/index.ts"],
//   format: ["esm", "cjs", "iife"],
//   globalName: "BjPass",
//   dts: true,
//   splitting: false,
//   sourcemap: true,
//   clean: true,
//   minify: true,
//   treeshake: true,
//   platform: "browser",
//   target: "es2020"
// });

import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  treeshake: true,
  target: "es2020",
});
