import {Output} from "./RecordOutput";
import {Input} from "../input/Input";
import {UdbOutputRecord} from "./db/udb/UdbOutputRecord";

export class Memory implements Input<UdbOutputRecord>, Output {
  records = [];
  private recordIndex;

  hasNext(): boolean {
    return this.recordIndex < this.records.length - 1;
  }

  readRecord(): UdbOutputRecord {
    return this.records[this.recordIndex];
  }

  goToRecord(recordIndex: number) {
    this.recordIndex = recordIndex;
  }

  write(record): boolean {
    this.records.push(record);
    return true;
  }
}