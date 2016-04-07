/**
 *
 * @authors     gooofly (http://gooofly.com, wangfei.f2e@gmail.com)
 * @date        2016-03-10 17:27:56
 * @title       title
 * @description description
 */
'use strict';

module.exports = options => {
  const
    defaultOptions = {
      LOWERAMPM: ['上午', '下午'],
      UPPERAMPM: ['上午', '下午'],
      DAY: [
        '星期日', '星期一', '星期二',
        '星期三', '星期四', '星期五', '星期六'
      ],
      SHORTDAY: [
        '周日', '周一', '周二',
        '周三', '周四', '周五', '周六'
      ],
      MONTH: [
        '1月', '2月', '3月', '4月', '5月', '6月',
        '7月', '8月', '9月', '10月', '11月', '12月'
      ],
      SHORTMONTH: [
        '1月', '2月', '3月', '4月', '5月', '6月',
        '7月', '8月', '9月', '10月', '11月', '12月'
      ]
    },
    /**
     * [description]
     * @param  {[type]} number [description]
     * @param  {[type]} length [description]
     * @return {[type]}        [description]
     */
    padStart = (number, length) => {
      number = String(number);
      while (number.length < length) {
        number = '0'+ number;
      }

      return number;
    },
    /**
     * [description]
     * @param  {[type]} number [description]
     * @param  {[type]} length [description]
     * @return {[type]}        [description]
     */
    trimStart = (number, length) => {
      number = String(number);
      return number.substr(number.length - length);
    },
    /**
     * 获取当前日期／月份／小时／分钟／秒的数字形式
     * @param  {String} type   想获取的值的类型
     * @param  {Number} length 返回值的长度
     * @param  {Number} offset 返回值的偏移量矫正
     * @param  {Boolean} trim   过长是否切除前面的部分
     * @param  {Date Object} dateObj 日期对象
     * @return {String | Number}        [description]
     */
    get = (type, length, offset, trim) => dateObj => {
      let value = dateObj['get'+ type]();

      (offset > 0 || value > -offset) && (value += offset);
      (value === 0 && offset === -12) && (value = 12);
      value = padStart(value, length);

      if ( trim ) {
        value = trimStart(value, length);
      }

      return value;
    },
    /**
     * 获取当前日期／月份／小时／分钟／秒的字符串形式
     * @param  {String} type   想获取的值的类型
     * @param  {Boolean} shortName 是否返回简写
     * @param  {Date Object} dateObj 日期对象
     * @return {[type]}           [description]
     */
    getStr = (type, shortName) => dateObj => {
      let
        valueIndex = dateObj['get'+ type]();

      return options[(shortName ? 'short'+ type : type).toUpperCase()][valueIndex];
    },
    /**
     * 返回时区
     * @param  {[type]} type [description]
     * @param  {Date Object} dateObj 日期对象
     * @return {[type]}      [description]
     */
    // getTimezone = type => dateObj => {
    //   let
    //     zone = dateObj.getTimezoneOffset(),
    //     prefix = zone <= 0 ? '+' : '-';

    //   return prefix +
    //          padStart(Math[zone < 0 ? 'floor' : 'ceil'](Math.abs(zone) / 60), 2) +
    //          (type || '') +
    //          padStart(Math.abs(zone % 60), 2);
    // },
    /**
     * 返回当前年是否为闰年
     * @param  {Date Object | String | Number} dateObj 日期对象
     * @return {Boolean}         [description]
     */
    isLeap = dateObj => {
      if ( ~['string', 'number'].indexOf(typeof dateObj)  ) {
        dateObj = new Date(dateObj, 2, 0);
      }
      else {
        dateObj = new Date(dateObj.getFullYear(), 2, 0);
      }

      return dateObj.getDate() === 29;
    },
    /**
     * [description]
     * @param  {Date Object} dateObj 日期对象
     * @return {[type]}         [description]
     */
    getMaxDayOfMonth = (year, month) => new Date(year, month, 0).getDate(),
    /**
     * 获取当前时间是上午还是下午
     * @param  {[type]} upper [description]
     * @param  {Date Object} dateObj 日期对象
     * @return {[type]}       [description]
     */
    getAmPm = upper => dateObj => {
      let
        type = ((upper ? 'upper' : 'lower') +'AMPM').toUpperCase(),
        valueIndex = dateObj.getHours() < 12 ? 0 : 1;

      return options[type][valueIndex];
    },
    /**
     * 返回当前日期是今年的第几个星期
     * 特殊用法：返回一年有几个星期getWeeks(2014))
     * @param  {Date Object | Number | String} dateObj 一个日期对象，或者表示年份的字符串／数字
     * @return {Number}         返回当前日期是第几个星期／该年份有多少个星期
     */
    getWeeks = dateObj => {
      let
        yearStart,
        day;
      // 如果传入字符串或者数字，则认为传入的是年，需要返回当年的星期总数
      if ( ~['string', 'number'].indexOf(typeof dateObj)  ) {
        dateObj = new Date(dateObj, 11, 31);
      }
      // else {

        // dateObj = new Date(+dateObj); // copy date so don't modify original
        // dateObj.setHours(0, 0, 0);
      // }

      yearStart = new Date(dateObj.getFullYear(), 0, 1); // get first day of year
      day = yearStart.getDay();

      return Math.ceil(((dateObj - yearStart) / 86400000 + 1 + day ) / 7);
    },
    /**
     * 获取今天是今年的第几天
     * @param  {Date Object} dateObj 日期对象
     * @return {Number}         在这一年中的第几天
     */
    getDayInYear = dateObj => {
      let yearStart;

      yearStart = new Date(dateObj.getFullYear(), 0, 1);

      return Math.ceil((dateObj - yearStart) / 864e5);
    },

    // MAP_SPLIT = /Y|y|F|m|M|n|d|j|g|G|h|H|i|s|a|A|D|l|w/g,
    MAPS = {
      // A full numeric representation of a year, 4 digits
      // Examples: 1999 or 2003
      Y: get('FullYear', 4),
      // A two digit representation of a year
      // Examples: 99 or 03
      y: get('FullYear', 2, 0, true),

      // A full textual representation of a month, such as January or March
      // January through December
      F: getStr('Month'),
      // Numeric representation of a month, with leading zeros
      // 01 through 12
      m: get('Month', 2, 1),
      // A short textual representation of a month, three letters
      // Jan through Dec
      M: getStr('Month', true),
      // Numeric representation of a month, without leading zeros
      // 1 through 12
      n: get('Month', 1, 1),

      // Day of the month, 2 digits with leading zeros
      // 01 to 31
      d: get('Date', 2),
      // Day of the month without leading zeros
      // 1 to 31
      j: get('Date', 1),

      // 12-hour format of an hour without leading zeros
      // 1 through 12
      g: get('Hours', 1, -12),
      // 24-hour format of an hour without leading zeros
      // 0 through 23
      G: get('Hours', 1),
      // 12-hour format of an hour with leading zeros
      // 01 through 12
      h: get('Hours', 2, -12),
      // 24-hour format of an hour with leading zeros
      // 00 throught 23
      H: get('Hours', 2),
      // Minutes with leading zeros
      // 00 to 59
      i: get('Minutes', 2),
      // Seconds, with leading zeros
      // 00 to 59
      s: get('Seconds', 2),

      // Lowercase Ante meridiem and Post meridiem
      // am or pm
      a: getAmPm(),
      // Uppercase Ante meridiem and Post meridiem
      // AM or PM
      A: getAmPm(true),

      // A textual representation of a day, three letters
      // Mon through Sun
      D: getStr('Day', true),
      // A full textual representation of the day of the week
      // Sunday through Saturday
      l: getStr('Day'),
      // Numeric representation of the day of the week
      // 0 (for Sunday) through 6 (for Saturday)
      w: get('Day')
    };

  // 设置可配置项
  options = Object.assign({}, defaultOptions, options || {});

  return {
    // format (dateObj, format = 'Y-m-d') {
    format (dateObj, format) {
      format || (format = 'Y-m-d');
      let
        MAP_SPLIT = /Y|y|F|m|M|n|d|j|g|G|h|H|i|s|a|A|D|l|w/g,
        str = format,
        match;

      if ( ['string', 'number'].indexOf(typeof dateObj) !== -1 ) {
        dateObj = new Date(dateObj, 0);
      }
      if ( Number.isNaN(+dateObj) ) {
        return null;
      }

      while ((match = MAP_SPLIT.exec(format))) {
        match = match[0];
        str = str.replace(match, MAPS[match](dateObj));
      }

      return str;
    },
    // parse (valueStr, format = 'Y-m-d') {
    parse (valueStr, format) {
      format || (format = 'Y-m-d');
      let
        MAP_SPLIT = /Y|F|m|M|n|d|j|g|G|h|H|i|s|a|A/g,

        key, // 格式关键字
        charAfterKey, // 关键字后一个字符
        pos = 0, // 111
        tempIndex = 0, // 记录上一次匹配的位置
        temp,
        val = {}, // 保存format中关键词对应的key value

        today = new Date(),
        year = today.getFullYear(),
        month = 1,
        day = 1,
        hours = 0,
        minutes = 0,
        seconds = 0;


      if (!valueStr) {
        return null;
      }
      if (valueStr.getTime) {
        return valueStr;
      }

      while ((key = MAP_SPLIT.exec(format))) {

        charAfterKey = format.slice(key.index + 1, key.index + 2);
        pos && (pos += (key.index - tempIndex - 1)); // 计算两次匹配之间的字符数

        if ( charAfterKey ) {
          temp = valueStr.indexOf(charAfterKey, pos);
          val[key] = valueStr.slice(pos, temp);
          pos = temp;
        }
        else { // 遍历结束
          val[key] = valueStr.slice(pos);
        }

        tempIndex = key.index;
      }
      // Year
      val.Y && (year = val.Y);
      // Month
      val.m && (month = val.m - 1);
      val.n && (month = val.n - 1);
      val.F && (month = options.MONTH.indexOf(val.F));
      val.M && (month = options.SHORTMONTH.indexOf(val.M));
      // Day
      val.d && (day = val.d);
      val.j && (day = val.j);

      // Hours
      hours = val.H || val.G || val.h || val.g || 0;
      hours = Number(hours);
      if (hours) {

        if (val.a || val.A) {
          if ( options.LOWERAMPM.indexOf(val.a || val.A) === 0 ) {
            if ( hours === 12 ) {
              hours = 0;
            }
          }
          else {
            if ( hours !== 12 ) {
              hours += 12;
            }
          }
        }
      }
      val.i && (minutes = val.i);
      val.s && (seconds = val.s);

      return new Date(year, month, day, hours, minutes, seconds);
    },

    // getTimezone: getTimezone(':'),
    isLeap,
    getMaxDayOfMonth,
    getWeeks,
    getDayInYear
  };
};
