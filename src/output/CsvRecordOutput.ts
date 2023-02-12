import {Output, RecordOutput} from "./RecordOutput"
import {UdbRecord} from "../input/db/UdbRecord"

export class CsvRecordOutput implements RecordOutput<UdbRecord> {

  private separator: string = ","

  constructor(private output: Output<string>, private sortedRecord: UdbRecord, params?: any) {
    if (params.separator) {
      this.separator = params.separator
    }
    const headerRecord = {}
    for (let prop in this.sortedRecord) {
      headerRecord[prop] = prop
    }
    this.output.write(this.desc(headerRecord) + "\n")
  }

  static csvValue(value) {
    if (typeof value === 'string') {
      value = value.replace(/"/g, '""');  // Escape quotes in value
      value = `"${value}"`;
    }
    return value;
  }

  desc(record: Record<string, any>) {
    let str = ""
    let sep = ""
    for (let prop in this.sortedRecord) {
      let value = record[prop]
      str += sep + CsvRecordOutput.csvValue(value)
      sep = this.separator
    }
    return str
  }

  getColumns(record: UdbRecord) {
    return Object.keys(this.sortedRecord)
  }

  write(record: UdbRecord) {
    this.output.write(this.desc(record) + "\n")
  }

  end() {}

  toString() {
    return `CVS output in ${this.output}`;
  }
}
