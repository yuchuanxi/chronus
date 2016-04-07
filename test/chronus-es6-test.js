/**
 *
 * @authors     yuChuanXi (http://yuchuanxi.com, wangfei.f2e@gmail.com)
 * @date        2016-03-23 17:24:35
 * @title       title
 * @description description
 */
/* global describe:true, it:true */
'use strict';

var
  chronus = require('../src/chronus-es6.js')(),
  expect = require('chai').expect;

describe('chronus.parse', function () {
  var
    date1 = +new Date(2015, 11, 23),
    date2 = +new Date(2015, 0, 23),

    testParse = function (str, format, timestamp) {
      it('chronus.parse("'+ str +( format ? '", "'+ format +'"' : '') +')', function () {
        expect(+chronus.parse(str, format)).to.be.equal(timestamp);
      });
    };

  // Year Month Day
  testParse('2015-12-23', null, date1);
  testParse('2015-12-23', 'Y-m-d', date1);
  testParse('12/23/2015', 'm/d/Y', date1);
  testParse('12/03/2015', 'm/d/Y', +new Date(2015, 11, 3));
  testParse('12/3/2015', 'm/j/Y', +new Date(2015, 11, 3));
  testParse('12-23-2015', 'm-d-Y', date1);
  testParse('2015-12-23', 'Y-n-d', date1);
  testParse('2015/12/23', 'Y/m/d', date1);
  testParse('2015年01月23日', 'Y年m月d日', date2);
  testParse('2015年1月23日', 'Y年n月d日', date2);
  testParse('2015年/1月/23日', 'Y年/F/d日', date2);
  testParse('2015年/1月/23日', 'Y年/M/d日', date2);
  testParse('2015年 1月 23日', 'Y年 M d日', date2);
  // Year Month
  testParse('2015-12', 'Y-m', +new Date(2015, 11));
  testParse('2015/12', 'Y/m', +new Date(2015, 11));
  // Year
  testParse('2015', 'Y', +new Date(2015, 1));

  // Year Month Day Hours Minutes Seconds
  testParse('2015-02-8 9:26:58', 'Y-m-d h:i:s', +new Date(2015, 1, 8, 9, 26, 58));
  testParse('2015-02-8 09:26:58', 'Y-m-d H:i:s', +new Date(2015, 1, 8, 9, 26, 58));
  testParse('2015-02-8 09:26:58 下午', 'Y-m-d H:i:s a', +new Date(2015, 1, 8, 21, 26, 58));
  testParse('2015-02-8 9:26', 'Y-m-d h:i', +new Date(2015, 1, 8, 9, 26));
  testParse('2015-02-8 9', 'Y-m-d h', +new Date(2015, 1, 8, 9));
});

describe('chronus.format', function () {
  var
    date1 = new Date(2015, 2, 8, 9, 10, 20),
    date2 = new Date(2015, 2, 8, 21, 8, 20),
    testFormart1 = function (date, format, str) {
      it('chronus.format(new Date(2015, 2, 8, 9, 10, 20)' +( format ? '", "'+ format +'"' : '') +') === \''+ str + '\'', function () {
        expect(chronus.format(date, format)).to.be.equal(str);
      });
    },
    testFormart2 = function (date, format, str) {
      it('chronus.format(new Date(2015, 2, 8, 21, 8, 20)' +( format ? '", "'+ format +'"' : '') +') === \''+ str + '\'', function () {
        expect(chronus.format(date, format)).to.be.equal(str);
      });
    };

  testFormart1(date1, null, '2015-03-08');
  testFormart1(date1, 'Y-m-d', '2015-03-08');
  testFormart1(date1, 'Y-n-d', '2015-3-08');
  testFormart1(date1, 'Y/m/d', '2015/03/08');
  testFormart1(date1, 'Y年m月d日', '2015年03月08日');
  testFormart1(date1, 'Y年m月d日 H', '2015年03月08日 09');
  testFormart1(date1, 'Y年m月d日 h', '2015年03月08日 09');
  testFormart2(date2, 'Y年m月d日 H', '2015年03月08日 21');
  testFormart2(date2, 'Y年m月d日 G', '2015年03月08日 21');
  testFormart2(date2, 'Y年m月d日 g', '2015年03月08日 9');
  testFormart1(date1, 'Y年m月d日 H A', '2015年03月08日 09 上午');
  testFormart2(date2, 'Y年m月d日 G A', '2015年03月08日 21 下午');
  testFormart2(date2, 'Y年m月d日 h A', '2015年03月08日 09 下午');
  testFormart1(date1, 'Y年m月d日 AH点', '2015年03月08日 上午09点');
  testFormart1(date1, 'l', '星期日');
  testFormart1(date1, 'D', '周日');
  testFormart1(date1, 'w', '0');
});

describe('chronus.isLeap(date object) 是否闰年', function () {
  it('chronus.isLeap(new Date(2015, 2))=== false', function () {
    expect(chronus.isLeap(new Date(2015, 2))).to.be.equal(false);
  });
  it('chronus.isLeap(new Date(2016, 2))=== true', function () {
    expect(chronus.isLeap(new Date(2016, 2))).to.be.equal(true);
  });
  it('chronus.isLeap(new Date(2000, 2))=== true', function () {
    expect(chronus.isLeap(new Date(2000, 2))).to.be.equal(true);
  });
  it('chronus.isLeap(new Date(1900, 2))=== false', function () {
    expect(chronus.isLeap(new Date(1900, 2))).to.be.equal(false);
  });
});

describe('chronus.getMaxDayOfMonth(year, month) 某年某月的天数', function () {
  it('chronus.getMaxDayOfMonth(2015, 2)=== 28', function () {
    expect(chronus.getMaxDayOfMonth(2015, 2)).to.be.equal(28);
  });
  it('chronus.getMaxDayOfMonth(2016, 2)=== 29', function () {
    expect(chronus.getMaxDayOfMonth(2016, 2)).to.be.equal(29);
  });
  it('chronus.getMaxDayOfMonth(2000, 2)=== 29', function () {
    expect(chronus.getMaxDayOfMonth(2000, 2)).to.be.equal(29);
  });
  it('chronus.getMaxDayOfMonth(1900, 2)=== 28', function () {
    expect(chronus.getMaxDayOfMonth(1900, 2)).to.be.equal(28);
  });
  it('chronus.getMaxDayOfMonth(2016, 3)=== 31', function () {
    expect(chronus.getMaxDayOfMonth(2016, 3)).to.be.equal(31);
  });
});

describe('chronus.getWeeks(date object) 返回当前日期是今年第几个星期', function () {
  it('chronus.getWeeks(new Date(2015, 11, 1))=== 49', function () {
    expect(chronus.getWeeks(new Date(2015, 11, 1))).to.be.equal(49);
  });
  it('chronus.getWeeks(new Date(2015, 11, 31))=== 53', function () {
    expect(chronus.getWeeks(new Date(2015, 11, 31))).to.be.equal(53);
  });
  it('chronus.getWeeks(new Date(2016, 0, 1))=== 1', function () {
    expect(chronus.getWeeks(new Date(2016, 0, 1))).to.be.equal(1);
  });
  it('chronus.getWeeks(new Date(2016, 0, 3))=== 2', function () {
    expect(chronus.getWeeks(new Date(2016, 0, 3))).to.be.equal(2);
  });
  it('chronus.getWeeks(new Date(2016, 2, 2))=== 10', function () {
    expect(chronus.getWeeks(new Date(2016, 2, 2))).to.be.equal(10);
  });
  it('chronus.getWeeks(2015)=== 53', function () {
    expect(chronus.getWeeks(2015)).to.be.equal(53);
  });
});

describe('chronus.getDayInYear(date object) 获取今天是今年的第几天', function () {
  it('chronus.getDayInYear(new Date(2015, 11, 1, 1))=== 335', function () {
    expect(chronus.getDayInYear(new Date(2015, 11, 1, 1))).to.be.equal(335);
  });
  it('chronus.getDayInYear(new Date(2015, 11, 31, 1))=== 365', function () {
    expect(chronus.getDayInYear(new Date(2015, 11, 31, 1))).to.be.equal(365);
  });
  it('chronus.getDayInYear(new Date(2016, 0, 1, 1))=== 1', function () {
    expect(chronus.getDayInYear(new Date(2016, 0, 1, 1))).to.be.equal(1);
  });
  it('chronus.getDayInYear(new Date(2016, 0, 3, 1))=== 3', function () {
    expect(chronus.getDayInYear(new Date(2016, 0, 3, 1))).to.be.equal(3);
  });
  it('chronus.getDayInYear(new Date(2016, 2, 2, 1))=== 62', function () {
    expect(chronus.getDayInYear(new Date(2016, 2, 2, 1))).to.be.equal(62);
  });
});

// module.exports = null;
