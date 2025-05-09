module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  setupFilesAfterEnv: ["./jest.setup.js"],
  testTimeout: 10000,
  moduleNameMapper: {
    "^@root/(.*)$": "<rootDir>/$1",
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@domain/(.*)$": "<rootDir>/src/domain/$1",
    "^@infrastructure/(.*)$": "<rootDir>/src/infrastructure/$1",
    "^@persistence$": "<rootDir>/src/infrastructure/persistence",
    "^@persistence/(.*)$": "<rootDir>/src/infrastructure/persistence/$1",
    "^@web/(.*)$": "<rootDir>/src/infrastructure/web/$1",
    "^@express/(.*)$": "<rootDir>/src/infrastructure/web/express/$1",
    "^@express/routes(.*)$":
      "<rootDir>/src/infrastructure/web/express/routes/$1",
  },
  maxWorkers: 1,
};
