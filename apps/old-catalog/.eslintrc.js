/** @type {import("eslint").Linter.Config} */
module.exports = {
    root: true,
    extends: ["@klofan/eslint-config/internal-lib.js"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: "./tsconfig.json",
    },
  };
  