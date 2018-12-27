let config = require('./jest.config');
config.testMatch = [ '**/__tests__/integration/**/*.itest.ts' ];
console.log('*** RUNNING INTEGRATION TESTS ***');

module.exports = config;