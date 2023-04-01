// const jestMongoDbPreset = require("@shelf/jest-mongodb/jest-preset");

// module.exports = {
//   ...jestMongoDbPreset,
//   preset: 'ts-jest',
//   // Without Typescript can just use:
//   // preset: '@shelf/jest-mongodb',
//   // testEnvironment: 'node',
//   watchPathIgnorePatterns: ['globalConfig'],
//   testMatch: [
//     '**/tests/**/*.test.ts?(x)'
//   ],
//   collectCoverage: false,
// };


module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  watchPathIgnorePatterns: ['globalConfig'],
  testMatch: [
    '**/tests/**/*.test.ts?(x)'
  ],
  collectCoverage: false,
};


// module.exports = {
//   preset: '@shelf/jest-mongodb',
//   watchPathIgnorePatterns: ['globalConfig'],
//   testMatch: [
//     '**/tests/**/playground.test.ts?(x)'
//   ],
//   collectCoverage: false,
// };
