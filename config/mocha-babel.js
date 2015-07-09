// ChaiAsPromised setup
//
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

// http://derpturkey.com/testing-asyncawait-with-babel-and-mocha
//
var STAGE = require('../package.json').config.stage;

require('babel/register')({
  stage: STAGE
});

// Unhandled rejection handling
//
process.on('unhandledRejection', function(reason) {
  console.log("Unhandled Rejection, reason:", reason);
  if(reason.stack) {
    console.err(reason.stack);
  }
});