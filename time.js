function accuracy(value, valueAccuracy, questionMark) {
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
  let num = parseInt(accurateValue);
  return isNaN(num) ? accurateValue : num;
}

exports.getDay = function (record, padding = false) {
  const dayAccuracy = (record.ymdt >> 2) & 3;
  let day = padding ? (record.day > 31 ? '--' : (record.day < 10 ? '0' : '') + record.day) : record.day;
  return accuracy(day, dayAccuracy, padding);
};

exports.getMonth = function (record, padding = false) {
  const monthAccuracy = (record.ymdt >> 4) & 3;
  let month = padding ? (record.month < 10 ? '0' : '') + record.month : record.month;
  return accuracy(month, monthAccuracy, padding);
};

exports.getYear = function (record) {
  const yearAccuracy = (record.ymdt >> 6) & 3;
  return accuracy(record.year, yearAccuracy);
};

exports.getTime = function (record) {
  let time = record.hour;
  const timeAccuracy = record.ymdt & 3;
  let hours = Math.floor(time / 6);
  let minutes = (time % 6) * 10;
  return accuracy((hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes, timeAccuracy);
};

