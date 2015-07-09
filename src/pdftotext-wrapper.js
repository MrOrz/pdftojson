/*
Note: This tool uses exec, which is vulnerable to shell injection.
Please make sure it is not exposed to the public!
*/

import {exec} from 'child_process';

const TAG = 'pdftotext',
      debug = require('debug')(TAG);

export default function pdftotext(fileName, options = {}) {

  return new Promise((resolve, reject) => {
    var childProcess = exec(`pdftotext -bbox ${options.config || ''} "${fileName}" -`, (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(stdout);
    });

    childProcess.stderr.on('data', data => {
      console.error(TAG, data);
    });
  });
}
