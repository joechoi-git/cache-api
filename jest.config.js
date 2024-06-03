/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testTimeout: 30000
};

// unit tests can run on a custom port
process.env = Object.assign(process.env, {
    PORT: "3030"
});
