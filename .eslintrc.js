module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    },
  plugins: ['@typescript-eslint', 'prettier'
    ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'next/core-web-vitals',
    '@typescript-eslint/recommended',
    'next/typescript',
    'prettier',
    ],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['warn',
            { argsIgnorePattern: '^_'
            }
        ],
    'react/react-in-jsx-scope': 'off',
    'prefer-const': 'error',
    'no-unused-vars': 'error',
    'no-console': 'warn',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-undef': 'error',
    },
  settings: {
    react: {
      version: 'detect',
        },
    },
  ignores: ['.next/', 'node_modules/', 'dist/', 'build/'
    ],
};
