let config = require('./jest.config');
config.testMatch = [ '**/__tests__/unit/**/*.ts' ];
console.log('*** RUNNING UNIT TESTS ***');
module.exports = config;