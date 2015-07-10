import {expect} from 'chai';
import pdftojson from '../../src';

describe('pdftojson', () => {
  it('should parse pdf', () => {
    return pdftojson('test/fixture/twolines.pdf').then(pages => {
      debugger;
      expect(pages.length).to.equal(1);
      expect(pages[0].words.map(w => w.text)).to.deep.equal([
        '中文  English  にほんご',
        'All in 1 line!'
      ]);
    });
  });
});
