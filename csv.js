const util = require('./util');

exports.CsvRecordOutput = class CsvRecordOutput {

  constructor(separator, output, sortedRecord) {
    this.separator = separator;
    this.output = output;
    this.sortedRecord = sortedRecord;

    const headerRecord = {};
    for (let prop in this.sortedRecord) {
      headerRecord[prop] = prop;
    }
    this.output.write(this.desc(headerRecord) + '\n');
  }

  csvValue(value) {
    if (typeof value === 'string') {
      value = value.replace(/"/g, '""');  // Escape quotes in value
      value = '"' + value + '"';
    }
    return value;
  }

  desc(record) {
    let str = '';
    let sep = '';
    for (let prop in this.sortedRecord) {
      let value = record[prop];
      str += sep + this.csvValue(value);
      sep = this.separator;
    }
    return str;
  }

  getColumns(record) {
    return Object.keys(this.sortedRecord);
  }

  write(record) {
    this.output.write(this.desc(record) + '\n');
  }

  end() {}
};
