import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@app-store$': '<rootDir>/src/services/store.ts',
    '^@slices(.*)$': '<rootDir>/src/services/slices$1',
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@ui(.*)$': '<rootDir>/src/components/ui$1',
    '^@ui-pages(.*)$': '<rootDir>/src/components/ui/pages$1',
    '^@utils-types(.*)$': '<rootDir>/src/utils/types$1',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@selectors(.*)$': '<rootDir>/src/services/selectors$1',
    '^@cookie$': '<rootDir>/src/utils/cookie.ts',
    '^@pages(.*)$': '<rootDir>/src/pages$1',
  }
};

export default config;
