import wrapper from './pdftotext-wrapper';
import parser from './parser';
import {sortWords, removeDuplicateWords, mergeWordsInLines} from './processor';

// Unhandled rejection handling
//
/* istanbul ignore next */
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

  htmlData = await wrapper(pdfFileName, options.cmd);
  pages = parser.parse(htmlData);
  pages.forEach(page => {
    if (options.sort) {
      page.words = sortWords(page.words);
    }
    page.words = mergeWordsInLines(removeDuplicateWords(page.words));
  });

  return pages;
}
