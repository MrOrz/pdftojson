import {expect} from 'chai';
import {Text} from '../../src/parser';
import processor from '../../src/processor';

describe('processor', () => {
  describe('#removeDuplicateWords', () => {
    it('should remove duplicate, overlapped words on the same line', () => {
      const INPUT = [
              new Text(213.780000, 269.740485, 305.855700, 319.821720, '旅遊深度'),
              new Text(256.200000, 284.154400, 305.855700, 319.821720, '度。'),
              new Text(131.699331, 173.634390, 330.875700, 344.841720, '為滿足'),
              new Text(159.660000, 215.620485, 330.875700, 344.841720, '足民眾對'),
              new Text(201.420000, 271.364667, 330.875700, 344.841720, '對濱海地區')
            ],
            OUTPUT = processor.removeDuplicateWords(INPUT);

      // yMin and yMax should not be altered.
      OUTPUT.forEach((word, idx) => {
        expect(word.yMin).to.equal(INPUT[idx].yMin);
        expect(word.yMax).to.equal(INPUT[idx].yMax);
      });

      // The word that has duplicate text with previous word should be altered.
      expect(OUTPUT[1].text).to.equal('。');
      expect(OUTPUT[3].text).to.equal('民眾對');
      expect(OUTPUT[4].text).to.equal('濱海地區');

      [1, 3, 4].forEach((idx) => {
        expect(OUTPUT[idx].width).to.be.below(INPUT[idx].width);
        expect(OUTPUT[idx].xMin).to.be.above(INPUT[idx].xMin);
      });
    });

    it('should remove empty words after duplication removal', () => {
      const INPUT = [
              new Text(527.400000, 541.374400, 430.835700, 444.801720, '全'),
              new Text(83.940000, 111.954480, 455.855700, 469.821720, '長約'),
              new Text(98.100000, 112.074400, 455.855700, 469.821720, '約'),
              new Text(115.620000, 143.531069, 455.855700, 469.821720, '21.5')
            ],
            OUTPUT = processor.removeDuplicateWords(INPUT);

      expect(OUTPUT.map(w => w.text)).to.deep.equal(['全', '長約', '21.5']);
    });

    it('should handle the case that duplicate & overlap may also happen at word start', () => {
      const INPUT = [
              /* case that second word longer: */
              new Text(153.000000, 166.974400, 355.835700, 369.801720, '本'),
              new Text(153.000000, 222.944667, 355.835700, 369.801720, '本計畫已委'),

              /* case that first word longer: */
              new Text(153.000000, 208.914369, 697.355700, 711.321720, '本案已於'),
              new Text(212.160000, 233.126541, 697.355700, 711.321720, '104'),
              new Text(212.400000, 219.387200, 697.355700, 711.321720, '1'),
              new Text(236.519525, 250.493925, 697.355700, 711.321720, '年')
            ],
            OUTPUT = processor.removeDuplicateWords(INPUT);

      expect(OUTPUT.map(w => w.text)).to.deep.equal([
        '本', '計畫已委',
        '本案已於', '104', '年'
      ]);
    });

    it('should not remove duplicate words that is not in the same line, since they cannot "overlap"', () => {
      const INPUT = [
              new Text(106.016352, 252.974112, 555.815616, 569.781636, '(1)航空城捷運線(綠線)'),
              new Text(152.936028, 320.863788, 580.775508, 594.741528, '航空城捷運線(綠線)總長約')
            ],
            OUTPUT = processor.removeDuplicateWords(INPUT);

      expect(OUTPUT).to.deep.equal(INPUT);
    });

  });

  describe('#mergeWordsInLines', () => {
    it('should join text instances into one if in the same line', () => {
      const INPUT = [
              new Text(126.000330, 412.962198, 694.295316, 708.261336, '第二期(桃園火車站至機場捷運線山鼻站，長約'),
              new Text(416.500536, 430.494516, 694.295316, 708.261336, '12'),
              new Text(434.003496, 538.951356, 694.295316, 708.261336, '公里)建設。桃林'),
              new Text(126.000330, 167.968290, 719.315322, 733.281342, '鐵路於'),
              new Text(171.506628, 192.518568, 719.315322, 733.281342, '101')
            ],
            OUTPUT = processor.mergeWordsInLines(INPUT);

      // Text should merge
      expect(OUTPUT.map(w => w.text)).to.deep.equal(['第二期(桃園火車站至機場捷運線山鼻站，長約 12 公里)建設。桃林', '鐵路於 101']);

      // Bounding box should merge.
      //
      [
        //  xMin        xMax        yMin        yMax
        [126.000330, 538.951356, 694.295316, 708.261336],
        [126.000330, 192.518568, 719.315322, 733.281342]

      ].forEach((expectedBox, idx) => {
        var {xMin, xMax, yMin, yMax} = OUTPUT[idx];

        expect([xMin, xMax, yMin, yMax]).to.deep.equal(expectedBox);
      });

    });
    /*
    */
  });
});
/*
*/
