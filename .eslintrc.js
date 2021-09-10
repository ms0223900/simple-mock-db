module.exports = {
  root: true,
  env: {
      node: true,
  },
  plugins: [
    '@typescript-eslint',
  ],
  settings: {
      'import/extensions': ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      'import/resolver': {
          node: {
              extensions: ['.js', '.jsx', '.ts', '.tsx'],
              moduleDirectory: ['node_modules', 'src/', 'bbnews-types/'],
          },
          webpack: {
              config: 'node_modules/@vue/cli-service/webpack.config.js',
          },
      },
  },
  "parser": "@typescript-eslint/parser",
  extends: [
    'plugin:import/typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  "rules": {
    "indent": 0,
    "@typescript-eslint/indent": ["warn", 2],
    "semi": [
      "warn",
      "always"
    ],
  },
  
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 2020
  }
}