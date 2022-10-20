import {Output, RecordOutput} from "./RecordOutput.js"
import {UdbRecord} from "../input/db/UdbRecord.js"

export class MemoryRecordOutput implements RecordOutput<UdbRecord> {

  constructor(private output: Output<UdbRecord>, private sortedRecord, params: any) {
  }

  desc(record): UdbRecord {
    const sorted = <UdbRecord>{}
    for (let prop in this.sortedRecord) {
      if (this.sortedRecord.hasOwnProperty(prop)) {
        sorted[prop] = record[prop]
      }
    }
    return sorted
  }


  write(record: UdbRecord) {
    this.output.write(this.desc(record))
  }

  end() {
  }

  toString() {
    return "Memory record output"
  }
}
