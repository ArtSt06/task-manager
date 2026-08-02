module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
    "^@middleware/(.*)$": "<rootDir>/src/middleware/$1",
    "^@models/(.*)$": "<rootDir>/src/models/$1",
    "^@routes/(.*)$": "<rootDir>/src/routes/$1",
    "^@shared/(.*)$": "<rootDir>/../shared/$1",
    "^@tests/(.*)$": "<rootDir>/src/__tests__/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",

    "^firebase-admin$": "<rootDir>/src/__tests__/__mocks__/firebase-admin.ts",
    "^firebase-admin/(.*)$":
      "<rootDir>/src/__tests__/__mocks__/firebase-admin.ts",
  },
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
};
