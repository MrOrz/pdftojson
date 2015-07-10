import parser from '../../src/parser';
import {expect} from 'chai';

describe('parser', () => {
  it('should parse HTML', () => {

    const input = `
      <body>
      <doc>
        <page width="595.000000" height="842.000000">
          <word xMin="44.879482" yMin="98.279297" xMax="104.845258" yMax="157.919274">桃</word>
          <word xMin="134.878961" yMin="98.279297" xMax="194.844737" yMax="157.919274">園</word>
          <word xMin="224.878439" yMin="98.279297" xMax="284.844215" yMax="157.919274">市</word>
        </page>
      </doc>
      </body>
    `, expectedOutput = [
      {
        width: 595, height: 842,
        words: [
          {
            xMin:44.879482, yMin:98.279297, xMax:104.845258, yMax:157.919274,
            width:104.845258 - 44.879482, height:157.919274 - 98.279297 , text:'桃'
          },
          {
            xMin:134.878961, yMin:98.279297, xMax:194.844737, yMax:157.919274,
            width:194.844737 - 134.878961, height:157.919274 - 98.279297 , text:'園'
          },
          {
            xMin:224.878439, yMin:98.279297, xMax:284.844215, yMax:157.919274,
            width:284.844215 - 224.878439, height:157.919274 - 98.279297 , text:'市'
          }
        ]
      }
    ];

    return expect(parser.parse(input)).to.deep.equal(expectedOutput);
  });
});
