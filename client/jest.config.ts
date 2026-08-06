import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.tsx", "**/__tests__/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  moduleNameMapper: {
    "^@api/(.*)$": "<rootDir>/src/api/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@contexts/(.*)$": "<rootDir>/src/contexts/$1",
    "^@firebase_setup/(.*)$": "<rootDir>/src/__tests__/__mocks__/firebase/auth.ts",
    "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@shared/(.*)$": "<rootDir>/../shared/$1",
    "^@store/(.*)$": "<rootDir>/src/store/$1",
    "^@tests/(.*)$": "<rootDir>/src/__tests__/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",

    "\\.(scss|css|sass)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.app.json",
        isolatedModules: true,
        esModuleInterop: true,
      },
    ],
  },
  moduleDirectories: ["node_modules", "src"],
  transformIgnorePatterns: [
    "/node_modules/(?!react-router-dom|@firebase|firebase)",
  ],
};

export default config;