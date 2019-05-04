import {Output, RecordOutput} from "./RecordOutput";
import {Record} from "../input/db/RecordReader";

const json2xml = require('json2xml');

export class XmlRecordOutput implements RecordOutput {

  constructor(private output: Output, private sortedRecord: Record, params: any) {
    this.output.write('<?xml version="1.0" encoding="UTF-8"?>\n<udb>\n')
  }

  desc(record: Record) {
    return json2xml(record).toString();
  }

  write(record: Record) {
    const Record: Record = <Record>{};
    for (let prop in this.sortedRecord) {
      Record[prop] = record[prop];
    }
    this.output.write(`<record>${this.desc(Record)}</record>\n`);
  }

  end() {
    this.output.write('</udb>')
  }

  toString() {
    return 'XML output to ' + this.output;
  }
}
