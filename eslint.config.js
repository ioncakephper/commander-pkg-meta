const globals = require('globals');
const pluginJs = require('@eslint/js');
const prettier = require('eslint-config-prettier'); // Import prettier config

module.exports = [
  {
    files: ['**/*.js'], // Apply to all .js files
    languageOptions: {
      globals: {
        ...globals.commonjs,
        ...globals.node,
        ...globals.jest, // Add jest globals
      },
      ecmaVersion: 2021,
      sourceType: 'commonjs', // For commonjs modules
    },
    rules: {
      // Add any specific rules or override recommended ones here
    },
  },
  pluginJs.configs.recommended,
  prettier, // Add prettier as the last item
];
