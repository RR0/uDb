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
