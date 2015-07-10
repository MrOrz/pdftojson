import wrapper from './pdftotext-wrapper';
import parser from './parser';
import {removeDuplicateWords, mergeWordsInLines} from './processor';

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
  var htmlData, pages;

  htmlData = await wrapper(pdfFileName, options.config);
  pages = parser.parse(htmlData);

  // pages.forEach(page => {
  //   page.words = mergeWordsInLines(removeDuplicateWords(page.words));
  // });

  return pages;
}
