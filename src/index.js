import promisify from 'es6-promisify';

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
export default async function pdftojson(pdfFileName, options) {
  await new Promise((resolve, reject) => {
    setTimeout(resolve, 1000);
  });
  return options;
}
