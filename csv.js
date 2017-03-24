exports.CsvRecordOutput = class CsvRecordOutput {
  constructor(separator, output) {
    this.separator = separator;
    this.output = output;
  }

  csvValue(value) {
    if (typeof value === 'string') {
      value = value.replace(/"/g, '""');  // Escape quotes in value
      value = '"' + value + '"';
    }
    return value;
  }

  format(record) {
    return record;
  }

  desc(record) {
    let str = '';
    let sep = '';
    for (let i = 0; i < this.props.length; ++i) {
      const prop = this.props[i];
      let value = record[prop];
      str += sep + this.csvValue(value);
      sep = this.separator;
    }
    return str;
  }

  getColumnValue(record, prop) {
    return record[prop];
  }

  getColumns(record) {
    return Object.keys(record);
  }

  write(record) {
    if (!this.props) {
      this.props = this.getColumns(record);
      const headerRecord = {};
      for (let i = 0; i < this.props.length; ++i) {
        const prop = this.props[i];
        headerRecord[prop] = prop;
      }
      this.output.write(this.desc(headerRecord) + '\n');
    }
    record = this.format(record);
    this.output.write(this.desc(record) + '\n');
  }
};
