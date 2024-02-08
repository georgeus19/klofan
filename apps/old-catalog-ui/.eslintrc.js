/** @type {import("eslint").Linter.Config} */
module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: ['@klofan/eslint-config/react.js'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
    },
    ignorePatterns: ['*.config.*'],
    // rules: {
    //   'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    // }
};
