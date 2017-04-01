import {RecordOutput} from "./output";
import {OutputRecord} from "./OutputRecord";
const json2xml = require('json2xml');

export class XmlRecordOutput implements RecordOutput {

  constructor(private output, private sortedRecord) {
    this.output.write('<?xml version="1.0" encoding="UTF-8"?>\n<udb>\n')
  }

  desc(record: OutputRecord) {
    return json2xml(record).toString();
  }

  write(record: OutputRecord) {
    const OutputRecord: OutputRecord = <OutputRecord>{};
    for (let prop in this.sortedRecord) {
      OutputRecord[prop] = record[prop];
    }
    this.output.write(`<record>${this.desc(OutputRecord)}</record>\n`);
  }

  end() {
    this.output.write('</udb>')
  }
}
