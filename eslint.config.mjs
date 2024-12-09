const pluginJs = require('@eslint/js');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const globals = require('globals');

/** @type {import('eslint').Linter.Config} */
module.exports = {
  overrides: [
    {
      files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
      languageOptions: { sourceType: 'commonjs', globals: globals.browser },
      rules: {
        'no-unused-vars': 'error',
        'no-undef': 'error',
        'no-unused-expressions': 'error',
        'prefer-const': 'error',
        'no-console': 'warn',
        'prettier/prettier': 'error',
      },
    },
  ],
  plugins: [pluginJs, eslintPluginPrettierRecommended],
};
