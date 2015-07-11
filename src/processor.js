// Given a list of Text instance,
// remove the duplicate, overlapping words.
//
import {Text} from './parser'

const LINE_THRESHOLD_PT = 2, // pts difference to differentiate lines.
      SPACE_THRESHOLD_PT = 3; // pts difference for two words to be separate

function removeDuplicateWords(words) {

  const wordCount = words.length;

  // If only got 0 or 1 word, skip this.
  //
  if (wordCount <= 1) {
    return words;
  }

  // Round the pt values to integer because words might be displaced
  // by the software generates the PDF.
  //
  var processedWords = [words[0]],
      lastWord = words[0],
      lastRoundedYMin = Math.round(words[0].yMin),
      lastRoundedYMax = Math.round(words[0].yMax),
      lastRoundedXMin = Math.round(words[0].xMin),
      lastRoundedXMax = Math.round(words[0].xMax);

  for (let i = 1; i < wordCount; i += 1) {
    let word = words[i],
        roundedYMin = Math.round(word.yMin),
        roundedYMax = Math.round(word.yMax),
        roundedXMin = Math.round(word.xMin),
        roundedXMax = Math.round(word.xMax);

    if (lastRoundedYMin !== roundedYMin || lastRoundedYMax !== roundedYMax) {
      // Not in the same line, just update line data
      [lastRoundedYMin, lastRoundedYMax] = [roundedYMin, roundedYMax];

    } else if (roundedXMin < lastRoundedXMax) {
      // Overlapping detected.

      if (roundedXMax <= lastRoundedXMax) {
        // Current word is totally overlapping with previous word.
        // Skip this word entirely.
        continue;

      } else {
        let lastText = lastWord.text,
            overlappingWidth = lastRoundedXMax - roundedXMin,
            wordCountToDelete = Math.round(word.text.length * overlappingWidth / word.width);

        // Shrink the word count to delete in case of deleting too much
        //
        while (
          wordCountToDelete > 0 &&
          lastText.slice(-wordCountToDelete) !== word.text.slice(0, wordCountToDelete)
        ) {
          wordCountToDelete -= 1;
        }

        // Create a new Text instance to be pused to processedWords.
        //
        let newXMin = word.xMin + word.width * (wordCountToDelete / word.text.length);
        word = new Text(newXMin, word.xMax, word.yMin, word.yMax, word.text.slice(wordCountToDelete));
      }
    }

    // Update horizontal data and last word before pushing a valid word
    // into processedWords[].
    //
    [lastRoundedXMin, lastRoundedXMax, lastWord] = [roundedXMin, roundedXMax, word];
    processedWords.push(word);
  }

  return processedWords;
}

// Given all the words (Text instance array) of a page,
// join adjacent words if they are at the same line,
// and return new words array.
//
function mergeWordsInLines(words) {
  const wordCount = words.length;

  // If only got 0 or 1 word, skip this.
  //
  if (wordCount <= 1) {
    return words;
  }

  // Round the pt values to integer because words might be displaced
  // by the software generates the PDF.
  //
  var processedLines = [],
      wordsInLine = [words[0]],
      lineXMin = words[0].xMin,
      lineXMax = words[0].xMax,
      lineYMin = words[0].yMin,
      lineYMax = words[0].yMax;

  for (let i = 1; i < wordCount; i += 1) {
    let word = words[i];

    if (Math.abs(lineYMin - word.yMin) < LINE_THRESHOLD_PT &&
        Math.abs(lineYMax - word.yMax) < LINE_THRESHOLD_PT) {
      // In the same line. Update line data.
      // Note: Chinese & English words in a same line may have different
      // yMin and yMax. Thus we use THRESHOLD to determine if two words
      // lies in the same line.
      //
      if (word.xMax > lineXMax) {
        lineXMax = word.xMax;
      }
      if (word.yMin < lineYMin) {
        lineYMin = word.yMin;
      }
      if (word.yMax > lineYMax) {
        lineYMax = word.yMax;
      }
      wordsInLine.push(word);

    } else {
      pushLineToProcessed();

      // Reset line data
      //
      [
        lineXMin, lineXMax, lineYMin, lineYMax
      ] = [
        word.xMin, word.xMax, word.yMin, word.yMax
      ];

      wordsInLine = [word];
    }
  }
  pushLineToProcessed();

  return processedLines;

  // Push last line in processedLines
  //
  function pushLineToProcessed() {

    var text = wordsInLine[0].text;

    for (let i = 1; i < wordsInLine.length; i += 1) {
      // Add space in between only when there is space between two bounding
      // boxes.
      //
      if (wordsInLine[i].xMin - wordsInLine[i - 1].xMax > SPACE_THRESHOLD_PT) {
        text += ' ';
      }
      text += wordsInLine[i].text;
    }

    processedLines.push(new Text(lineXMin, lineXMax, lineYMin, lineYMax, text));
  }
}

function sortWords(words) {
  return words.slice(0).sort((word1, word2) => {
    // Sort in order: yMin, yMax, xMin and xMax

    if(word1.yMin === word2.yMin){
      if(word1.yMax === word2.yMax){
        if(word1.xMin === word2.xMin){
          return word1.xMax - word2.xMax;
        }
        return word1.xMin - word2.xMin;
      }
      return word1.yMax - word2.yMax;
    }
    return word1.yMin - word2.yMin;
  });
}

export default {removeDuplicateWords, mergeWordsInLines, sortWords};
