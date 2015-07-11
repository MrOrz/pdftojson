/*
Note: This tool uses exec, which is vulnerable to shell injection.
Please make sure it is not exposed to the public!
*/

import fs from 'fs';
import {exec} from 'child_process';
import tmp from 'tmp';

const TAG = 'pdftotext',
      debug = require('debug')(TAG);

export default function pdftotext(fileName, config = '') {

  return new Promise((resolve, reject) => {
    var tmpObj = tmp.fileSync(),
        childProcess = exec(`pdftotext -bbox ${config} "${fileName}" ${tmpObj.name}`, (err, stdout) => {
          if (err) {reject(err); return; }

          resolve(fs.readFileSync(tmpObj.name, {encoding: 'utf8'}));
          tmpObj.removeCallback();
        });

    childProcess.stderr.on('data', data => {
      console.error(TAG, data);
    });
  });
}
