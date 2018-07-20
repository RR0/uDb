export class Time {
  static accuracy(value, valueAccuracy, questionMark?): string | number {
    let accurateValue = '';
    switch (valueAccuracy) {
      case 0:
        break;
      case 1:
        accurateValue = questionMark ? '?' : '';
        break;
      case 2:
        accurateValue = '~';
      case 3:
        accurateValue += value;
    }
    let num = parseInt(accurateValue, 10);
    return num.toString() != accurateValue ? accurateValue : num;
  }

  static getDay(record, padding = false) {
    const dayAccuracy = (record.ymdt >> 2) & 0b11;
    let day = padding ? (record.day > 31 ? '--' : (record.day < 10 ? '0' : '') + record.day) : record.day;
    return Time.accuracy(day, dayAccuracy, padding);
  }

  static getMonth = function (record, padding = false) {
    const monthAccuracy = (record.ymdt >> 4) & 0b11;
    let month = padding ? (record.month < 10 ? '0' : '') + record.month : record.month;
    return Time.accuracy(month, monthAccuracy, padding);
  };

  static getYear(record) {
    const yearAccuracy = (record.ymdt >> 6) & 0b11;
    return Time.accuracy(record.year, yearAccuracy);
  }

  static getTime(record): string | number {
    let time = record.time;
    const timeAccuracy = record.ymdt & 0b11;
    let hours = Math.floor(time / 6);
    let minutes = (time % 6) * 10;
    return Time.accuracy((hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes, timeAccuracy);
  }
}

