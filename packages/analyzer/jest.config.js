/** @type {import('jest').Config} */
const config = {
    preset: 'ts-jest',
    // Automatically clear mock calls, instances, contexts and results before every test
    clearMocks: true,
    // Indicates which provider should be used to instrument code for coverage
    coverageProvider: 'v8',
    // The test environment that will be used for testing
    testEnvironment: 'jsdom',
    rootDir: './src',
};

module.exports = config;
