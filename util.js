exports.forEachBit = function (flagsByte, cb) {
  let byte = flagsByte;
  for (let i = 0; i < 8; i++) {
    const bit = byte & 1;
    if (bit) {
      cb(i);
    }
    byte = byte >> 1;
  }
};

exports.trimZeroEnd = function (str) {
  const zeroEnd = str.indexOf('\u0000');
  if (zeroEnd > 0) {
    str = str.substring(0, zeroEnd);
  }
  return str;
};

exports.copy = function (record) {
  return JSON.parse(JSON.stringify(record));
};
