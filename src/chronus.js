/**
 *
 * @authors gooofly (wangfei@51xianqu.net, http://www.gooofly.com)
 * @date    2015-10-23 13:47:30
 * @version $Id$
 *
 * title
 * --------------------------------------------
 */

var dateModule = {

  settings: {

    LOWERAMPM: ['上午', '下午'],
    UPPERAMPM: ['上午', '下午'],
    DAY: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    SHORTDAY: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    MONTH: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月',
        '10月', '11月', '12月'],
    SHORTMONTH: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月',
        '10月', '11月', '12月']
  },
  /**
   * format date according to PHP `date`
   * @param  {[type]} date   [date型对象／字符串：'2014-1-1'／时间戳：1446798236695]
   * @param  {[type]} format [description]
   * @return {[type]}        [description]
   */
  format: (function () {
    var
      FORMATS_SPLIT = /d|D|j|l|w|z|W|F|m|M|n|t|L|Y|y|a|A|h|H|g|G|i|s|O|P|Z|r/g,
      /**
       * 数字用0补足
       * @param  {[type]} number [需要转化的数字]
       * @param  {[type]} length [输出字符串的长度]
       * @param  {[type]} trim   [超出指定的length是否需要切掉前面的部分]
       * @return {[type]}        [转化为指定长度的字符串]
       */
      padNumber = function ( number, length, trim ) {

        number = String(number);
        while ( number.length < length ) {
          number = '0'+ number;
        }
        if ( trim ) {
          number = number.substr(number.length - length);
        }

        return number;
      },
      getNum = function ( name, length, offset, trim ) {
        return function ( dateObj ) {
          var
            value = dateObj['get'+ name]();

          (offset > 0 || value > -offset ) && (value += offset);
          (value === 0 && offset === -12) && (value = 12);

          return padNumber(value, length, trim);
        }
      },
      getStr = function ( name, shortName ) {
        return function ( dateObj ) {
          var
            value = dateObj['get'+ name](),
            get = (shortName ? 'SHORT'+ name : name).toUpperCase();


          return dateModule.settings[get][value];
        };
      },
      getTimezone = function ( type ) {
        return function ( dateObj ) {
          var
            zone = -1 * dateObj.getTimezoneOffset(),
            paddedZone = (zone >= 0) ? '+' : '';

          paddedZone += padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) +
            (type || '') + padNumber(Math.abs(zone % 60), 2);

          return paddedZone;
        };
      },
      isLeap = function ( dateObj ) {
        return new Date(dateObj.getFullYear(), 2, 0).getDate() === 29 ? 1 : 0;
      },
      getMaxDayOfMonth = function ( dateObj ) {
        return new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0).getDate();
      },
      toString = function ( dateObj ) {
        return dateObj.toString();
      },
      getAmPm = function ( upper ) {

        return function ( dateObj ) {
          var
            value = dateObj.getHours() < 12 ? 0 : 1;

          return dateModule.settings[upper ? 'UPPERAMPM' : 'LOWERAMPM'][value];
        };
      },
      getWeek = function ( dateObj ) {
        var
          yearStart,
          day;

        // copy date so don't modify original
        dateObj = new Date(dateObj);
        dateObj.setHours(0, 0, 0);
        // set to nearest thursday: current date + 4 - current day number
        // mask sunday's day number 7
        // dateObj.setDate(dateObj.getDate() - (dateObj.getDay() || 7) + 4);
        // dateObj.setDate(dateObj.getDate() - (dateObj.getDay() || 7) + 4);
        // get first day of year
        yearStart = new Date(dateObj.getFullYear(), 0, 1);
        day = yearStart.getDay();

        return Math.ceil( (((dateObj - yearStart) / 86400000) + 1 + day) / 7 );
      },
      getDayInYear = function ( dateObj ) {
        var
          yearStart;

        dateObj = new Date(dateObj);
        dateObj.setHours(0, 0, 0);

        yearStart = new Date(dateObj.getFullYear(), 0, 1);

        return Math.ceil( (dateObj - yearStart) / 86400000 ) + 1;
      },
      FORMATS = {
        // Day of the month, 2 digits with leading zeros
        // 01 to 31
        d: getNum('Date', 2),
        // Day of the month without leading zeros
        // 1 to 31
        j: getNum('Date', 1),
        // A textual representation of a day, three letters
        // Mon through Sun
        D: getStr('Day', true),
        // A full textual representation of the day of the week
        // Sunday through Saturday
        l: getStr('Day'),
        // Numeric representation of the day of the week
        // 0 (for Sunday) through 6 (for Saturday)
        w: getNum('Day'),
        // The day of the year (starting from 0)
        // 0 through 365
        z: getDayInYear,
        // ISO-8601 week number of year, weeks starting on Monday (added in PHP 4.1.0)
        // Example: 42 (the 42nd week in the year)
        W: getWeek,
        // A full textual representation of a month, such as January or March
        // January through December
        F: getStr('Month'),
        // Numeric representation of a month, with leading zeros
        // 01 through 12
        m: getNum('Month', 2, 1),
        // A short textual representation of a month, three letters
        // Jan through Dec
        M: getStr('Month', true),
        // Numeric representation of a month, without leading zeros
        // 1 through 12
        n: getNum('Month', 1, 1),
        // Number of days in the given month
        // 28 through 31
        t: getMaxDayOfMonth,
        // Whether it's a leap year
        // 1 if it is a leap year, 0 otherwise.
        L: isLeap,
        // A full numeric representation of a year, 4 digits
        // Examples: 1999 or 2003
        Y: getNum('FullYear', 4),
        // A two digit representation of a year
        // Examples: 99 or 03
        y: getNum('FullYear', 2, 0, true),
        // Lowercase Ante meridiem and Post meridiem
        // am or pm
        a: getAmPm(),
        // Uppercase Ante meridiem and Post meridiem
        // AM or PM
        A: getAmPm(true),
        // 12-hour format of an hour without leading zeros
        // 1 through 12
        g: getNum('Hours', 1, -12),
        // 24-hour format of an hour without leading zeros
        // 0 through 23
        G: getNum('Hours', 1),
        // 12-hour format of an hour with leading zeros
        // 01 through 12
        h: getNum('Hours', 2, -12),
        // 24-hour format of an hour with leading zeros
        // 00 throught 23
        H: getNum('Hours', 2),
        // Minutes with leading zeros
        // 00 to 59
        i: getNum('Minutes', 2),
        // Seconds, with leading zeros
        // 00 to 59
        s: getNum('Seconds', 2),
        // Difference to Greenwich time (GMT) in hours
        // Example: +0200
        O: getTimezone(),
        // Difference to Greenwich time (GMT) with colon between hours and minutes
        // Example: +02:00
        P: getTimezone(':'),
        // Timezone offset in seconds. The offset for timezones west of UTC
        // is always negative, and for those east of UTC is always positive.
        // -43200 through 50400
        Z: getNum('TimezoneOffset'),
        // » RFC 2822 formatted date
        // Example: Thu, 21 Dec 2000 16:01:07 +0200
        r: toString
        // Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)
        // U:
      };

    return function ( date, format ) {
      var
        text,
        match;

      format || (format = 'Y-m-d');
      text = format;
      // 字符串 eg: '2015-11-22' || 时间戳
      if ( typeof date === 'string' || typeof date === 'number' ) {
        date = new Date(date);
      }

      if ( isNaN(date.getTime()) ) { // 如果不是有效的时间格式
        return null;
      }

      while ( (match = FORMATS_SPLIT.exec(format)) ) {

        text = text.replace(match[0], FORMATS[match[0]](date));
      }

      return text;
    }
  }()),
  parse: function ( value, format ) {
    format || (format = 'Y-m-d');
    var
      FORMATS_SPLIT = /d|D|j|l|w|z|W|F|m|M|n|t|L|Y|y|a|A|h|H|g|G|i|s|O|P|Z|r/g,
      key, // format 关键词
      tempIndex = 0, // 记录正则匹配 key 的位置
      pos = 0, // value 字符串前一次切割的位置
      temp, // value 字符串前一次查找 charAfterKey 的位置
      charAfterKey, // 关键词后一个字符
      val = {}, // 保存format关键词对应的key value
      settings = dateModule.settings,

      today = new Date(),
      year = today.getFullYear(),
      month = 1,
      day = 1,
      hours = 0,
      minutes = 0,
      seconds = 0;

    if ( !value || !format ) {
      return new Date();
    }
    if ( value.getTime ) { // value已经是一个date类型
      return value;
    }

    while ( (key = FORMATS_SPLIT.exec(format)) ) {

      charAfterKey = format.slice(key.index+1, key.index + 2);
      pos && (pos += (key.index - tempIndex - 1)); // 计算两次匹配之间的字符数
      if ( charAfterKey ) {

        temp = value.indexOf(charAfterKey, pos);
        val[key] = value.slice(pos, temp);
        pos = temp;
      }
      else { // 已经查找到最后，直接赋值
        val[key] = value.slice(pos);
      }
      tempIndex = key.index;
    }

    // Year
    val.Y && (year = val.Y);
    // Month
    val.m && (month = val.m - 1);
    val.n && (month = val.n - 1);
    val.F && (month = settings.MONTH.indexOf(val.F));
    val.M && (month = settings.SHORTMONTH.indexOf(val.M));
    // Day
    val.d && (day = val.d);
    val.j && (day = val.j);

    // Hours
    hours = val.H || val.G || val.h || val.g || 0;
    hours = Number(hours);
    if (hours) {

      if (val.a || val.A) {
        if ( settings.LOWERAMPM.indexOf(val.a || val.A) === 0 ) {
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

    return new Date( year, month, day, hours || 0, minutes || 0, seconds || 0);
  }
};

module.exports = dateModule;
