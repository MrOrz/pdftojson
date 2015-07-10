import promisify from 'es6-promisify';
import wrapper from './pdftotext-wrapper';

// Unhandled rejection handling
//
process.on('unhandledRejection', (reason) => {
  console.log('Unhandled Rejection, reason:', reason);
  if (reason.stack) {
    console.err(reason.stack);
  }
});

// Main processor
//
export default async function pdftojson(pdfFileName, options = {}) {
  var htmlData = await wrapper(pdfFileName, options.config);
  return htmlData;
}
