module.exports = {
  extends: ['airbnb', 'airbnb/hooks', './base.js', 'plugin:react/recommended'],
  globals: {
    fetch: true,
    window: true,
  },
  plugins: ['react', 'jsx-a11y', 'react-hooks'],
  rules: {
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react/boolean-prop-naming': [
      1,
      {
        propTypeNames: ['bool', 'mutuallyExclusiveTrueProps'],
        rule: '^(is|has)[A-Z]([A-Za-z0-9]?)+',
      },
    ],
    'react/display-name': 0,
    'react/function-component-definition': 0,
    'react/jsx-closing-tag-location': 0,
    'react/jsx-filename-extension': [2, { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-props-no-spreading': 0,
    'react/no-multi-comp': [1, { ignoreStateless: true }],
    'react/no-unstable-nested-components': 1,
    'react/no-unused-prop-types': 1,
    'react/no-unused-state': 0,
    'react/prefer-stateless-function': [1, { ignorePureComponents: true }],
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 0, // suppress errors for missing 'import React' in files
    'react/require-default-props': 0,
    'react/sort-comp': 0,
  },
  settings: {
    'import/resolver': {
      // to allow for libraries with only .ios.js and .android.js exports without plain .js export
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    react: {
      version: 'detect',
    },
  },
}
