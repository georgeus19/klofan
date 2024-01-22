const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: ['eslint:recommended', 'prettier', 'eslint-config-turbo'],
    plugins: ['only-warn'],
    globals: {
        React: true,
        JSX: true,
    },
    env: {
        node: true,
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
        '*.config.js',
        '*.config.ts',
        'node_modules/',
        'dist/',
    ],
    overrides: [
        {
            files: ['src/**/*.js?(x)', 'src/**/*.ts?(x)'],
        },
    ],
    rules: {
        'no-unused-vars': 'off',
        'linebreak-style': ['error', 'unix'],
        semi: ['error', 'always'],
    },
};
