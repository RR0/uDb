import {RecordOutput} from "./output";
import {OutputRecord} from "./OutputRecord";
import WritableStream = NodeJS.WritableStream;

export class CsvRecordOutput implements RecordOutput {

  constructor(private output: WritableStream, private sortedRecord: OutputRecord, private separator: string = ',') {
    const headerRecord = {};
    for (let prop in this.sortedRecord) {
      headerRecord[prop] = prop;
    }
    this.output.write(this.desc(headerRecord));
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

  write(record: OutputRecord) {
    this.output.write(this.desc(record));
  }

  end() {}
}
