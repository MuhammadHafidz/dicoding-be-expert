module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true,
    commonjs: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    // Abaikan parameter yang tidak digunakan jika diawali dengan _
    'no-unused-vars': 'off',
  },
};
