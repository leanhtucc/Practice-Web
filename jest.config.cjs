module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
    },
    moduleNameMapper: {
        '\\.(css|svg|png|jpg)$': '<rootDir>/src/test-utils/fileMock.ts',
    },
    collectCoverageFrom: ['src/features/**/*.{ts,tsx}', '!src/**/*.test.{ts,tsx}', '!src/**/*Types.ts'],
};
