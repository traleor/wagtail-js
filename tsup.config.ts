import { defineConfig } from "tsup";

export default defineConfig(() => ({
  sourcemap: true,
  clean: true, // clean dist before build
  dts: true, // generate dts file for main module
  format: ["cjs", "esm"], // generate cjs and esm files
  minify: true,
  bundle: true,
  target: ["es2020"],
  entry: ["src/index.ts"],
}));
