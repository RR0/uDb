import {Output, RecordOutput} from "./RecordOutput";
import {Record} from "../input/db/RecordReader";

export class CsvRecordOutput implements RecordOutput {

  constructor(private output: Output, private sortedRecord: Record, private separator: string = ',') {
    const headerRecord = {};
    for (let prop in this.sortedRecord) {
      headerRecord[prop] = prop;
    }
    this.output.write(this.desc(headerRecord) + '\n');
  }

  static csvValue(value) {
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
      str += sep + CsvRecordOutput.csvValue(value);
      sep = this.separator;
    }
    return str;
  }

  getColumns(record) {
    return Object.keys(this.sortedRecord);
  }

  write(record: Record) {
    this.output.write(this.desc(record) + '\n');
  }

  end() {}

  toString() {
    return `CVS format in ${this.output}`;
  }
}
