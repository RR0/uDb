import {Output, RecordOutput} from "./RecordOutput";
import {Record} from "../input/db/RecordReader";

export class MemoryRecordOutput implements RecordOutput {

  constructor(private output: Output, private sortedRecord, params: any) {
  }

  desc(record) {
    const sorted = <Record>{};
    for (let prop in this.sortedRecord) {
      if (this.sortedRecord.hasOwnProperty(prop)) {
        sorted[prop] = record[prop];
      }
    }
    return sorted;
  }


  write(record: Record) {
    this.output.write(this.desc(record));
  }

  end() {
  }
}
