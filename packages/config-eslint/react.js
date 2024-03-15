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
    extends: [
        'eslint:recommended',
        'prettier',
        'eslint-config-turbo',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
    ],
    plugins: ['react-refresh', '@typescript-eslint'],
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
        '@typescript-eslint/switch-exhaustiveness-check': [
            'error',
            {
                allowDefaultCaseForExhaustiveSwitch: false,
                requireDefaultForNonUnion: true,
            },
        ],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        'no-constant-condition': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-base-to-string': 'off',
        '@typescript-eslint/no-redundant-type-constituents': 'off',
    },
};
