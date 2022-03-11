module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/../../setup-jest.ts'],
  "testRegex": "((\\.|/*.)(spec))\\.ts?$",
  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$|ol|observable-fns))'],
};
