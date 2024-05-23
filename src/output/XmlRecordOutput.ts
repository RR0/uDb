import {Output, RecordOutput} from "./RecordOutput"
import {UdbRecord} from "../input"
import json2xml from "json2xml"

export class XmlRecordOutput implements RecordOutput<Record<string, any>> {

  constructor(private output: Output<string>, private sortedRecord: UdbRecord) {
    this.output.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<udb>\n")
  }

  desc(record: UdbRecord) {
    return json2xml(record).toString()
  }

  write(record: Record<string, any>) {
    const Record: UdbRecord = <UdbRecord>{}
    for (let prop in this.sortedRecord) {
      Record[prop] = record[prop]
    }
    this.output.write(`<record>${this.desc(Record)}</record>\n`)
  }

  end() {
    this.output.write("</udb>")
  }

  toString() {
    return 'XML output to ' + this.output;
  }
}
