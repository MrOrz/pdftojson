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
              new Text(236.519525, 250.493925, 697.355700, 711.321720, '年'),

              /* case that first word is longer, followed by another duplicate */
              new Text(320.400000, 380.394692, 461.939700, 473.927700, '施政重點與'),
              new Text(320.520000, 332.515100, 461.939700, 473.927700, '施'),
              new Text(367.920000, 403.914896, 461.939700, 473.927700, '與期程')
            ],
            OUTPUT = processor.removeDuplicateWords(INPUT);

      expect(OUTPUT.map(w => w.text)).to.deep.equal([
        '本計畫已委',
        '本案已於', '104', '年',
        '施政重點與', '期程'
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
              new Text(171.506628, 192.518568, 719.315322, 733.281342, '101'),

              // ----- half-width / fullwidth mixed line height
              new Text(65.184, 69.85932,  94.71068, 107.34668, '('),
              new Text(69.744, 83.784,    92.45396, 106.49396, '一'),
              new Text(83.904, 88.57932,  94.71068, 107.34668, ')'),
              new Text(88.464, 200.65764, 92.45396, 106.49396, '建構軌道運輸路網'),

              // ----- English / Chinese mixed line height
              new Text(94.917757, 133.79398, 374.122707, 383.220624, '7、103'),
              new Text(137.03767, 486.962857, 372.619348, 385.371983, '年 9 月 3 日舉辦秋祭烈士入祀，計有方俊弘分隊長 1 人入祀。'),
            ],
            OUTPUT = processor.mergeWordsInLines(INPUT);

      // Text should merge
      expect(OUTPUT.map(w => w.text)).to.deep.equal([
        '第二期(桃園火車站至機場捷運線山鼻站，長約 12 公里)建設。桃林', '鐵路於 101',
        '(一)建構軌道運輸路網',
        '7、103 年 9 月 3 日舉辦秋祭烈士入祀，計有方俊弘分隊長 1 人入祀。'
      ]);

      // Bounding box should merge.
      //
      [
        //  xMin        xMax        yMin        yMax
        [126.000330, 538.951356, 694.295316, 708.261336],
        [126.000330, 192.518568, 719.315322, 733.281342],
        [65.184,     200.65764,  92.45396,   107.34668 ],
        [94.917757,  486.962857, 372.619348, 385.371983],

      ].forEach((expectedBox, idx) => {
        var {xMin, xMax, yMin, yMax} = OUTPUT[idx];

        expect([xMin, xMax, yMin, yMax]).to.deep.equal(expectedBox);
      });

    });

    it('should add space only when two boxes has space in betweeen', () => {
      const INPUT = [
        new Text(127.740000, 141.746541, 205.835700, 219.801720, 'A.'),
        /* Space should be preserved here */
        new Text(145.740000, 173.754480, 205.835700, 219.801720, '第一'),
        new Text(159.780000, 215.694400, 205.835700, 219.801720, '一部分：'),
        /* No space should be inserted here */
        new Text(215.520000, 271.434369, 205.835700, 219.801720, '龜山區山'),
        new Text(257.880000, 327.824667, 205.835700, 219.801720, '山鶯路至桃'),

        // -----

        new Text(126.060000, 133.047200, 155.855700, 169.821720, '4'),
        /* Space should be preserved here */
        new Text(136.560000, 164.574480, 155.855700, 169.821720, '線交'),
        new Text(150.600000, 220.544667, 155.855700, 169.821720, '交通壅塞問'),
        new Text(206.340000, 248.274400, 155.855700, 169.821720, '問題。'),

        // ----- sets SPACE_THRESHOLD_PT
        new Text(103.200000, 110.187200, 547.355700, 561.321720, '('),
        new Text(103.320000, 152.368008, 547.355700, 561.321720, '(6)綠線'),

        // ----- inaccurate boundingbox calculation may cause this to fail
        new Text(105.960000, 112.947200, 705.875700, 719.841720, '('),
        new Text(106.080000, 169.075867, 705.875700, 719.841720, '(1)居家服'),
      ],
      OUTPUT = processor.mergeWordsInLines(processor.removeDuplicateWords(INPUT));

      expect(OUTPUT, 'OUTPUT').to.have.length(4);
      expect(OUTPUT[0].text).to.equal('A. 第一部分：龜山區山鶯路至桃');
      expect(OUTPUT[1].text).to.equal('4 線交通壅塞問題。');
      expect(OUTPUT[2].text).to.equal('(6)綠線');
      expect(OUTPUT[3].text).to.equal('(1)居家服');
    });

  });

  describe('#sortWords', () => {
    it('should sort the words', () => {
      const INPUT = [
        new Text(5, 20, 0, 10, '3'),
        new Text(0, 10, 5, 10, '5'),
        new Text(0, 20, 0, 10, '2'),
        new Text(0, 10, 0, 20, '4'),
        new Text(0, 10, 0, 10, '1'),
      ],
      OUTPUT = processor.sortWords(INPUT);

      expect(OUTPUT.map(w => w.text)).to.deep.equal(['1', '2', '3', '4', '5'])
    })
  });
});
/*
*/
