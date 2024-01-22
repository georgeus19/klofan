const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/*
 * This is a custom ESLint configuration for use with
 * internal (bundled by their consumer) libraries
 * that utilize React.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: ['eslint:recommended', 'prettier', 'eslint-config-turbo', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
    plugins: ['react-refresh'],
    globals: {
        React: true,
        JSX: true,
    },
    env: {
        browser: true,
    },
    settings: {
        'import/resolver': {
            typescript: {
                project,
            },
        },
    },
    ignorePatterns: [
        // Ignore dotfiles
        '.*.js',
        'vite.config.ts',
        'node_modules/',
        'dist/',
    ],
    overrides: [
        // Force ESLint to detect .tsx files
        { files: ['src/**/*.js?(x)', 'src/**/*.ts?(x)'] },
    ],
    rules: {
        'react-refresh/only-export-components': 'off',
        'react-hooks/exhaustive-deps': 'off',
        'linebreak-style': ['error', 'unix'],
        semi: ['error', 'always'],
    },
};
