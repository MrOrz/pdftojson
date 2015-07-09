#!/usr/bin/env node

var pdftojson = require('../lib'),
    argv = require('yargs')
      .usage('Usage: $0 [options] pdfFile')
      .boolean(['sort'])
      .describe('sort', 'Ignores pdftotext\'s layout unfolding and sort the words according to their coordinates.')
      .demand(1)
      .epilog('Additional params will be passed to pdftojson.')
      .argv;

console.log(argv);