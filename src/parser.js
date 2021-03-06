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
    this.text = text;
  }

  get width() {
    return this.xMax - this.xMin;
  }

  get height() {
    return this.yMax - this.yMin;
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
          $word.attr('ymin'), $word.attr('ymax'), $word.text().trim()
        );
      }).get()
    );
  }).get();
}

export default {Page, Text, parse}
