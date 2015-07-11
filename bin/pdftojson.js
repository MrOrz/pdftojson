#!/usr/bin/env node

var fs = require('fs'),
    pdftojson = require('../lib'),
    argv = require('yargs')
      .usage('Usage: $0 [options] pdfFile')
      .version(function() {
        return require('../package').version;
      })
      .help('h')
      .alias('h', 'help')
      .options({
        sort: {
          describe: 'Ignores pdftotext\'s layout unfolding and sort the words according to their coordinates.',
          type: 'boolean'
        },

        o: {
          alias: 'output',
          describe: 'Output JSON file name',
          default: null,
          type: 'string'
        },

        c: {
          alias: 'cmd',
          describe: 'Command line options to pass to `pdftotext`. Note: `-bbox` is enforced.',
          default: '',
          type: 'string'
        }
      })
      .nargs({
        o: 1,
        c: 1
      })
      .example('$0 YourPDF.pdf', 'Generates YourPDF.json')
      .example('$0 -o test.json YourPDF.pdf', 'Generates test.json from YourPDF.pdf')
      .example('$0 -c "-f 3 -l 6" YourPDF.pdf', 'Only process page 3 ~ 6 of YourPDF.pdf.')
      .demand(1, 1)
      .argv,

    pdfFileName = argv._[0],
    jsonFileName = argv.output || pdfFileName.replace(/\.pdf$/i, '.json');

pdftojson(pdfFileName, argv).then(function(data) {
  fs.writeFileSync(jsonFileName, JSON.stringify(data));
}).catch(function(err) {
  console.error(err);
  if (err.stack) {
    console.error(err.stack);
  }
});
