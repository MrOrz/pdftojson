import cheerio from 'cheerio';

class Page {
  constructor (width, height, words = []) {
    this.width = +width;
    this.height = +height;
    this.words = words;
  }
}

class Text {
  constructor (xMin, xMax, yMin, yMax, text = '') {
    this.xMin = +xMin; this.xMax = +xMax;
    this.yMin = +yMin; this.yMax = +yMax;
    this.width = xMax - xMin;
    this.height = yMax - yMin;
    this.text = text;
  }
}

// Parse HTML strings into Word / Page object instances.
//
function parse(html, shouldSort) {
  var $ = cheerio.load(html);

  return $('page').map((idx, pageElem) => {
    var $page = $(pageElem);

    return new Page(
      $page.attr('width'), $page.attr('height'),
      $page.children('word').map((idx, wordElem) => {
        var $word = $(wordElem);

        return new Text(
          $word.attr('xmin'), $word.attr('xmax'),
          $word.attr('ymin'), $word.attr('ymax'), $word.text()
        );
      }).get()
    );
  }).get();
}

export default {Page, Text, parse}
