
module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    // disable the rule for all files
    '@typescript-eslint/explicit-function-return-type': 'off'
  }
}
