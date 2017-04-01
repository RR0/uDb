import {RecordOutput} from "./output";
import {FormattedRecord} from "../record";
const json2xml = require('json2xml');

export class XmlRecordOutput implements RecordOutput {

  constructor(private output, private sortedRecord) {
    this.output.write('<?xml version="1.0" encoding="UTF-8"?>\n<udb>\n')
  }

  desc(record: FormattedRecord) {
    return json2xml(record).toString();
  }

  write(record: FormattedRecord) {
    const formattedRecord: FormattedRecord = <FormattedRecord>{};
    for (let prop in this.sortedRecord) {
      formattedRecord[prop] = record[prop];
    }
    this.output.write(`<record>${this.desc(formattedRecord)}</record>\n`);
  }

  end() {
    this.output.write('</udb>')
  }
}
