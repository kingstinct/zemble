module.exports = {
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/typescript',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'import', 'functional', '@stylistic/ts'],
  rules: {
    '@typescript-eslint/consistent-type-exports': 2,
    '@typescript-eslint/consistent-type-imports': 2,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-empty-object-type': 1,
    indent: 0,
    'dot-notation': 0,
    '@stylistic/ts/indent': [
      'error',
      2,
      {
        VariableDeclarator: { const: 3, let: 2, var: 2 },
        ignoredNodes: ['JSXAttribute', 'JSXSpreadAttribute'],
        SwitchCase: 1,
      },
    ],
    '@typescript-eslint/no-empty-function': [1, { allow: ['arrowFunctions'] }],
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/no-implied-eval': 0,
    '@typescript-eslint/no-misused-promises': [
      'error',
      { checksVoidReturn: false },
    ],
    '@typescript-eslint/no-shadow': 1,
    'no-shadow': 0,
    '@typescript-eslint/no-unnecessary-type-assertion': 0,
    '@typescript-eslint/no-unsafe-argument': 1,
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/no-unsafe-assignment': 0,
    // would like to have these but they don't work well..
    '@typescript-eslint/no-unsafe-call': 0,
    '@typescript-eslint/no-unsafe-member-access': 0,
    '@typescript-eslint/no-unsafe-return': 0,
    '@typescript-eslint/no-use-before-define': [
      'error',
      { classes: true, functions: true, variables: false },
    ],
    '@typescript-eslint/prefer-includes': 2,
    '@typescript-eslint/promise-function-async': [2],
    '@typescript-eslint/restrict-template-expressions': 0,
    '@stylistic/ts/type-annotation-spacing': [
      2,
      {
        after: true,
        before: false,
        overrides: { arrow: { after: true, before: true } },
      },
    ],
    '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
  },
}
