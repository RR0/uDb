import {Output, RecordOutput} from "./RecordOutput";
import {OutputRecord} from "./OutputRecord";
import WritableStream = NodeJS.WritableStream;

export class MemoryRecordOutput implements RecordOutput {

  constructor(private output: Output, private sortedRecord) {
  }

  desc(record) {
    const sorted = <OutputRecord>{};
    for (let prop in this.sortedRecord) {
      sorted[prop] = record[prop];
    }
    return sorted;
  }


  write(record: OutputRecord) {
    this.output.write(this.desc(record));
  }

  end() {}
}
