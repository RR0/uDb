export class Util {

  static forEachBit(flagsByte, cb) {
    let byte = flagsByte
    for (let i = 0; i < 8; i++) {
      const bit = byte & 1
      if (bit) {
        cb(i)
      }
      byte = byte >> 1
    }
  }

  static trimZeroEnd(str) {
    const zeroEnd = str.indexOf("\u0000")
    if (zeroEnd > 0) {
      str = str.substring(0, zeroEnd)
    }
    return str
  }

  static copy(record) {
    return JSON.parse(JSON.stringify(record))
  }

  static sortProps(obj, sortFunc) {
    const newObj = {}
    Object.keys(obj)
      .sort(sortFunc)
      .forEach((key) => {
        newObj[key] = obj[key]
      })
    return newObj
  }

}
