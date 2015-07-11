import wrapper from '../../src/pdftotext-wrapper';
import {expect} from 'chai';

describe('pdftotext-wrapper', () => {
  it('should abort on non-exist PDF files', () => {
    return expect(wrapper('not-exist.pdf')).to.be.rejected;
  });

  it('should invoke pdftotext', () => {
    return expect(wrapper('test/fixture/oneword.pdf')).to.eventually.include('FOO_BAR');
  });

  it('should handle large PDF files', () => {
    return wrapper('test/fixture/large.pdf').then(html => {
      expect(html).to.be.a('string');
    });
  });

  it('should pass command through', () => {
    return wrapper('test/fixture/large.pdf', '-l 1').then(html => {
      expect(html.match(/<page/gi).length).to.equal(1);
    });
  });

});
