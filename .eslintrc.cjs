/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  env: {
    es2022: true
  },
  root: true,
  extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', '@vue/eslint-config-typescript', '@vue/eslint-config-prettier'],
  rules: {
    'no-undef': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { args: 'all', argsIgnorePattern: '^_' }],
    'vue/multi-word-component-names': 'off',
    'vue/require-default-prop': 'off',
    'vue/valid-v-slot': ['error', { allowModifiers: true }],
    'vue/html-self-closing': ['error', { html: { void: 'always', normal: 'any', component: 'always' }, svg: 'always', math: 'always' }]
  }
};
