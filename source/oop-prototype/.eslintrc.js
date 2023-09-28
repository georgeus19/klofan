module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    env: {
        node: true,
    },
    rules: {
        'no-var': 'warn',
        semi: 'error',
        // indent: ['error', 2, { SwitchCase: 1 }],
        'no-multi-spaces': 'error',
        'space-in-parens': 'error',
        'no-multiple-empty-lines': 'error',
        'prefer-const': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/no-var-requires': 'off',
        'no-empty': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
    },
};
