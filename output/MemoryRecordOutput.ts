import {Output, RecordOutput} from "./RecordOutput";
import {OutputRecord} from "./OutputRecord";
import WritableStream = NodeJS.WritableStream;

export class MemoryRecordOutput implements RecordOutput {

  constructor(private output: Output) {
  }

  write(record: OutputRecord) {
    this.output.write(record);
  }

  end() {}
}
