/* eslint-disable @typescript-eslint/no-var-requires,import/no-commonjs */
module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.eslint.json'],
  },
  plugins: ['@typescript-eslint', 'import', 'react'],
  rules: {
    // eslint
    'no-duplicate-imports': 'error',
    'no-unused-vars': 'off',
    'no-console': 'error',

    // @typescript-eslint/eslint-plugin
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          String: {
            message: 'Use string instead',
            fixWith: 'string',
          },
          Boolean: {
            message: 'Use boolean instead',
            fixWith: 'boolean',
          },
          Number: {
            message: 'Use number instead',
            fixWith: 'number',
          },
          Symbol: {
            message: 'Use symbol instead',
            fixWith: 'symbol',
          },
          Object: {
            message: 'Use object instead',
            fixWith: 'object',
          },
          Function: {
            message: [
              'The `Function` type accepts any function-like value.',
              'It provides no type safety when calling the function, which can be a common source of bugs.',
              'It also accepts things like class declarations, which will throw at runtime as they will not be called with `new`.',
              'If you are expecting the function to accept certain arguments, you should explicitly define the function shape.',
            ].join('\n'),
          },
          '{}': {
            message: [
              '`{}` actually means "any non-nullish value".',
              '- If you want a type meaning "any object", you probably want `object` instead.',
              '- If you want a type meaning "any value", you probably want `unknown` instead.',
              '- If you want a type meaning "empty object", you probably want `Record<string, never>` instead.',
            ].join('\n'),
          },
        },
        extendDefaults: false,
      },
    ],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-extraneous-class': 'error',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-this-alias': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        classes: false,
        functions: false,
        typedefs: false,
      },
    ],
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/prefer-ts-expect-error': 'error',

    // eslint-plugin-import
    'import/export': 'error',
    'import/extensions': ['error', 'never', { json: 'always' }],
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-absolute-path': 'error',
    'import/no-commonjs': 'error',
    'import/no-cycle': 'error',
    'import/no-default-export': 'error',
    'import/no-deprecated': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'packages/server/scripts/**/*',
          'scripts/**/*',
          'jest.config.js',
          'jest.config-pacts-*.js',
          '__config__/*.ts',
        ],
        optionalDependencies: false,
      },
    ],
    'import/no-internal-modules': [
      'error',
      {
        allow: [
          'msw/node',
          'io-ts/lib/*',
          'io-ts-types/lib/*',
          'fp-ts/lib/*',
          'ts-jest/utils',
        ],
      },
    ],
    'import/no-mutable-exports': 'error',
    'import/no-self-import': 'error',
    'import/no-unassigned-import': 'error',
    'import/no-useless-path-segments': [
      'error',
      {
        noUselessIndex: true,
      },
    ],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
        },
        groups: [
          ['builtin', 'external', 'internal'],
          ['parent', 'sibling', 'index', 'unknown'],
        ],
        'newlines-between': 'always',
      },
    ],

    // eslint-plugin-react
    'react/jsx-boolean-value': 'error',
    'react/jsx-curly-brace-presence': 'error',
    'react/prop-types': 'off',
  },
  settings: {
    react: {
      pragma: 'h',
      version: '16.8',
    },
  },
  overrides: [
    {
      files: [
        '__fixtures__/**/*',
        '__tests-pacts__/**/*',
        '__tests__/**/*',
        'jest.setup.ts',
        'jest.setup-pacts.ts',
      ],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
}
