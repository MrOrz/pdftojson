// ChaiAsPromised setup
//
var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

// http://derpturkey.com/testing-asyncawait-with-babel-and-mocha
//
var STAGE = require('../package.json').config.stage;

require('babel/register')({
  stage: STAGE,
  sourceMaps: 'inline',
  optional: ['runtime']
});

// Unhandled rejection handling
//
/* istanbul ignore next */
process.on('unhandledRejection', function(reason) {
  console.log('Unhandled Rejection, reason:', reason);
  if (reason.stack) {
    console.err(reason.stack);
  }
});
