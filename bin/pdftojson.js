#!/usr/bin/env node

var fs = require('fs'),
    pdftojson = require('../lib'),
    argv = require('yargs')
      .usage('Usage: $0 [options] pdfFile')
      .boolean(['sort'])
      .describe('sort', 'Ignores pdftotext\'s layout unfolding and sort the words according to their coordinates.')
      .default('output', null, 'Output JSON file name')
      .alias('output', 'o')
      .demand(1, 1)
      .epilog('Additional params will be passed to pdftojson.')
      .argv,

    pdfFileName = argv._[0],
    jsonFileName = argv.output || pdfFileName.replace(/\.pdf$/i, '.json');

pdftojson(pdfFileName, argv).then(function(data){
  fs.writeFileSync(jsonFileName, JSON.stringify(data));
}).catch(function(err){
  console.error(err);
  if(err.stack){
    console.error(err.stack);
  }
});
